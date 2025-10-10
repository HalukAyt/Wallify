import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import * as CameraRoll from '@react-native-camera-roll/camera-roll';
import { check, request, RESULTS, PERMISSIONS } from 'react-native-permissions';

async function ensurePermissions(): Promise<void> {
  if (Platform.OS === 'ios') {
    const perm = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
    const status = await check(perm);
    if (status !== RESULTS.GRANTED) {
      const res = await request(perm);
      if (res !== RESULTS.GRANTED) {
        throw new Error('Fotoğraflara kaydetme izni verilmedi (iOS).');
      }
    }
  } else {
    // Android 13+ için READ_MEDIA_IMAGES izni
    try {
      const status = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      if (status !== RESULTS.GRANTED) {
        const res = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        if (res !== RESULTS.GRANTED) {
          throw new Error('Galeriye kaydetme izni verilmedi (Android).');
        }
      }
    } catch {
      // Eski API seviyelerinde bu izin olmayabilir; sessizce geç
    }
  }
}

/**
 * Verilen URL'den resmi indirip galeriye kaydeder.
 */
export async function saveImageFromUrl(
  url: string,
  fileName?: string,
  album = 'Wallpapers'
): Promise<string> {
  await ensurePermissions();

  const urlPath = url.split('?')[0];
  const ext = urlPath.includes('.') ? urlPath.substring(urlPath.lastIndexOf('.') + 1) : 'jpg';
  const safeExt = ext.length > 4 ? 'jpg' : ext;
  const targetName = fileName ?? `wallpaper_${Date.now()}.${safeExt}`;

  const destPath = `${RNFS.CachesDirectoryPath}/${targetName}`;
  const { promise } = RNFS.downloadFile({ fromUrl: url, toFile: destPath });
  const res = await promise;

  if ((res.statusCode ?? 200) >= 400) {
    throw new Error(`İndirme başarısız (HTTP ${res.statusCode}).`);
  }

  // Bazı sürümlerde 'save', bazılarında 'saveAsset' bulunuyor.
  const saveFn =
    (CameraRoll as any).save ??
    (CameraRoll as any).saveAsset;

  if (!saveFn) {
    throw new Error('CameraRoll.save / saveAsset bulunamadı. Paket sürümünü kontrol edin.');
  }

  // save(tag: string, options?) veya saveAsset(localUri, options?)
  await saveFn(destPath, { type: 'photo', album });
  return destPath;
}
