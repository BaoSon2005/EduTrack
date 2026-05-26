import goi_ma_hoa from 'node:crypto'

export function tao_muoi() {
  return goi_ma_hoa.randomBytes(16).toString('hex')
}

export function bam_mat_khau(mat_khau, muoi) {
  return goi_ma_hoa.scryptSync(mat_khau, muoi, 64).toString('hex')
}

export function so_sanh_mat_khau(mat_khau, muoi, mat_khau_da_bam) {
  const da_bam = Buffer.from(bam_mat_khau(mat_khau, muoi), 'hex')
  const da_luu = Buffer.from(mat_khau_da_bam, 'hex')

  if (da_bam.length !== da_luu.length) {
    return false
  }

  return goi_ma_hoa.timingSafeEqual(da_bam, da_luu)
}

export function tao_ma_phien() {
  return goi_ma_hoa.randomBytes(32).toString('hex')
}

export function tao_ma_ngan(tien_to) {
  return `${tien_to}_${goi_ma_hoa.randomBytes(6).toString('hex')}`
}
