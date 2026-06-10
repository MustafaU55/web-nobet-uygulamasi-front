
import { getCookie } from '@/app/components/cookies'; // Çerez okuma fonksiyonunu içe aktar

export const isTokenExpired = () => {
  const token = getCookie('jwtToken'); // Çerezden token'ı al
  return !token; // Token yoksa true döner (geçersiz kabul et)
};