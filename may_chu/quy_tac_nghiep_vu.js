import { bam_mat_khau, so_sanh_mat_khau, tao_ma_ngan, tao_ma_phien, tao_muoi } from './tien_ich_bao_mat.js'

export const cac_loai_danh_sach = [
  'nguoi_dung',
  'vai_tro',
  'quyen_han',
  'vai_tro_quyen_han',
  'phong_ban',
  'khoa_ban',
  'doi_tuong_dao_tao',
  'khoa_hoc',
  'nganh_hoc',
  'mon_hoc',
  'phong_hoc',
  'lop_hoc',
  'hoc_vien_lop_hoc',
  'ho_so_hoc_vien',
  'ho_so_giao_vien',
  'tiet_hoc',
  'lich_hoc',
  'diem_thanh_phan',
  'lich_su_diem',
  'tep_tin',
  'quyen_xem_tai_lieu',
  'tai_lieu_giang_day',
  'tep_phu_luc_hoi_dong',
  'cuoc_hoi_thoai',
  'tin_nhan',
]

const khoa_chinh = {
  nguoi_dung: 'ma_nguoi_dung',
  vai_tro: 'ma_vai_tro',
  quyen_han: 'ma_quyen_han',
  phong_ban: 'ma_phong_ban',
  khoa_ban: 'ma_khoa_ban',
  doi_tuong_dao_tao: 'ma_doi_tuong_dao_tao',
  khoa_hoc: 'ma_khoa_hoc',
  nganh_hoc: 'ma_nganh_hoc',
  mon_hoc: 'ma_mon_hoc',
  phong_hoc: 'ma_phong_hoc',
  lop_hoc: 'ma_lop_hoc',
  ho_so_hoc_vien: 'ma_hoc_vien',
  ho_so_giao_vien: 'ma_giao_vien',
  tiet_hoc: 'ma_tiet_hoc',
  lich_hoc: 'ma_lich_hoc',
  diem_thanh_phan: 'ma_diem',
  tep_tin: 'ma_tep_tin',
  tai_lieu_giang_day: 'ma_tai_lieu_giang_day',
  tep_phu_luc_hoi_dong: 'ma_tep_phu_luc',
}

export function tim_nguoi_dung_theo_thu_dien_tu(kho_du_lieu, thu_dien_tu) {
  return kho_du_lieu.nguoi_dung.find((nguoi_dung) => nguoi_dung.thu_dien_tu === thu_dien_tu && !nguoi_dung.da_xoa)
}

export function tim_nguoi_dung_theo_phien(kho_du_lieu, ma_phien) {
  const phien = kho_du_lieu.phien_dang_nhap.find((muc) => muc.ma_phien === ma_phien && !muc.da_huy)

  if (!phien) {
    return null
  }

  return kho_du_lieu.nguoi_dung.find((nguoi_dung) => nguoi_dung.ma_nguoi_dung === phien.ma_nguoi_dung && !nguoi_dung.da_xoa) ?? null
}

export function xac_thuc_bang_mat_khau(kho_du_lieu, thu_dien_tu, mat_khau) {
  const nguoi_dung = tim_nguoi_dung_theo_thu_dien_tu(kho_du_lieu, thu_dien_tu)

  if (!nguoi_dung || !so_sanh_mat_khau(mat_khau, nguoi_dung.muoi_mat_khau, nguoi_dung.mat_khau_da_bam)) {
    return { thanh_cong: false, thong_bao: 'Thong tin dang nhap khong hop le.' }
  }

  return tao_phien_dang_nhap(kho_du_lieu, nguoi_dung)
}

export function xac_thuc_ben_ngoai(kho_du_lieu, ma_dang_nhap_ngoai, thu_dien_tu, ho_va_ten) {
  let nguoi_dung = kho_du_lieu.nguoi_dung.find((muc) => muc.ma_dang_nhap_ngoai === ma_dang_nhap_ngoai && !muc.da_xoa)

  if (!nguoi_dung && thu_dien_tu) {
    nguoi_dung = tim_nguoi_dung_theo_thu_dien_tu(kho_du_lieu, thu_dien_tu)
  }

  if (!nguoi_dung) {
    const muoi_mat_khau = tao_muoi()
    nguoi_dung = {
      ma_nguoi_dung: tao_ma_ngan('nd'),
      ho_va_ten: ho_va_ten || 'Nguoi dung moi',
      thu_dien_tu,
      muoi_mat_khau,
      mat_khau_da_bam: bam_mat_khau(tao_ma_phien(), muoi_mat_khau),
      ma_vai_tro: 'hoc_vien',
      ma_dang_nhap_ngoai,
      da_xoa: false,
      thoi_diem_xoa: null,
    }
    kho_du_lieu.nguoi_dung.push(nguoi_dung)
  }

  return tao_phien_dang_nhap(kho_du_lieu, nguoi_dung)
}

export function tao_phien_dang_nhap(kho_du_lieu, nguoi_dung) {
  const ma_phien = tao_ma_phien()
  kho_du_lieu.phien_dang_nhap.push({
    ma_phien,
    ma_nguoi_dung: nguoi_dung.ma_nguoi_dung,
    thoi_diem_tao: new Date().toISOString(),
    da_huy: false,
  })

  return {
    thanh_cong: true,
    ma_phien,
    nguoi_dung: bo_thong_tin_nhay_cam(nguoi_dung),
    quyen_han: lay_quyen_cua_nguoi_dung(kho_du_lieu, nguoi_dung),
    duong_dan_sau_dang_nhap: nguoi_dung.ma_vai_tro === 'giao_vien' ? '/lich-day-ca-nhan' : '/bang-dieu-khien',
  }
}

export function bo_thong_tin_nhay_cam(nguoi_dung) {
  const { muoi_mat_khau, mat_khau_da_bam, ...thong_tin_cong_khai } = nguoi_dung
  void muoi_mat_khau
  void mat_khau_da_bam
  return thong_tin_cong_khai
}

export function lay_quyen_cua_nguoi_dung(kho_du_lieu, nguoi_dung) {
  return kho_du_lieu.vai_tro_quyen_han
    .filter((muc) => muc.ma_vai_tro === nguoi_dung.ma_vai_tro)
    .map((muc) => muc.ma_quyen_han)
}

export function co_quyen(kho_du_lieu, nguoi_dung, ma_quyen_han) {
  return lay_quyen_cua_nguoi_dung(kho_du_lieu, nguoi_dung).includes(ma_quyen_han)
}

export function kiem_tra_quyen(kho_du_lieu, ma_quyen_han, xu_ly_tiep) {
  return async (ngu_canh) => {
    if (!ngu_canh.nguoi_dung) {
      return ngu_canh.tra_loi(401, { thanh_cong: false, thong_bao: 'Can dang nhap truoc khi su dung chuc nang nay.' })
    }

    if (!co_quyen(kho_du_lieu, ngu_canh.nguoi_dung, ma_quyen_han)) {
      return ngu_canh.tra_loi(403, { thanh_cong: false, thong_bao: 'Ban khong co quyen thuc hien yeu cau nay.' })
    }

    return xu_ly_tiep(ngu_canh)
  }
}

export function liet_ke_bang(kho_du_lieu, ten_bang) {
  if (!cac_loai_danh_sach.includes(ten_bang) || !Array.isArray(kho_du_lieu[ten_bang])) {
    return { thanh_cong: false, ma_loi: 400, thong_bao: 'Bang du lieu khong duoc ho tro.' }
  }

  const du_lieu = kho_du_lieu[ten_bang].filter((muc) => muc.da_xoa !== true)
  return { thanh_cong: true, du_lieu }
}

export function tao_ban_ghi(kho_du_lieu, ten_bang, du_lieu_vao) {
  if (!khoa_chinh[ten_bang]) {
    return { thanh_cong: false, ma_loi: 400, thong_bao: 'Bang du lieu khong cho tao truc tiep.' }
  }

  const khoa = khoa_chinh[ten_bang]
  const ban_ghi = {
    ...du_lieu_vao,
    [khoa]: du_lieu_vao[khoa] || tao_ma_ngan(khoa.replace('ma_', '')),
    da_xoa: du_lieu_vao.da_xoa ?? false,
  }
  kho_du_lieu[ten_bang].push(ban_ghi)

  return { thanh_cong: true, ban_ghi }
}

export function cap_nhat_ban_ghi(kho_du_lieu, ten_bang, ma_ban_ghi, du_lieu_vao) {
  const khoa = khoa_chinh[ten_bang]
  const ban_ghi = khoa ? kho_du_lieu[ten_bang]?.find((muc) => muc[khoa] === ma_ban_ghi) : null

  if (!ban_ghi) {
    return { thanh_cong: false, ma_loi: 404, thong_bao: 'Khong tim thay ban ghi.' }
  }

  Object.assign(ban_ghi, du_lieu_vao)
  return { thanh_cong: true, ban_ghi }
}

export function xoa_mem_ban_ghi(kho_du_lieu, ten_bang, ma_ban_ghi) {
  const ket_qua = cap_nhat_ban_ghi(kho_du_lieu, ten_bang, ma_ban_ghi, {
    da_xoa: true,
    thoi_diem_xoa: new Date().toISOString(),
  })
  return ket_qua
}

export function khoi_phuc_ban_ghi(kho_du_lieu, ten_bang, ma_ban_ghi) {
  return cap_nhat_ban_ghi(kho_du_lieu, ten_bang, ma_ban_ghi, { da_xoa: false, thoi_diem_xoa: null })
}

export function xoa_vinh_vien_ban_ghi(kho_du_lieu, ten_bang, ma_ban_ghi) {
  const khoa = khoa_chinh[ten_bang]
  const vi_tri = khoa ? kho_du_lieu[ten_bang]?.findIndex((muc) => muc[khoa] === ma_ban_ghi) : -1

  if (vi_tri < 0) {
    return { thanh_cong: false, ma_loi: 404, thong_bao: 'Khong tim thay ban ghi.' }
  }

  const ban_ghi = kho_du_lieu[ten_bang].splice(vi_tri, 1)[0]
  return { thanh_cong: true, ban_ghi }
}

export function kiem_tra_tiet_hoc_hop_le(kho_du_lieu, tiet_hoc) {
  if (tiet_hoc.thoi_gian_bat_dau >= tiet_hoc.thoi_gian_ket_thuc) {
    return { hop_le: false, thong_bao: 'Thoi gian bat dau phai nho hon thoi gian ket thuc.' }
  }

  const trung_khung = kho_du_lieu.tiet_hoc.some((muc) =>
    muc.ma_tiet_hoc !== tiet_hoc.ma_tiet_hoc &&
    muc.thoi_gian_bat_dau === tiet_hoc.thoi_gian_bat_dau &&
    muc.thoi_gian_ket_thuc === tiet_hoc.thoi_gian_ket_thuc,
  )

  return trung_khung
    ? { hop_le: false, thong_bao: 'Tiet hoc bi trung khung gio.' }
    : { hop_le: true }
}

export function kiem_tra_trung_lich(kho_du_lieu, lich_du_kien = []) {
  const tat_ca_lich = [...kho_du_lieu.lich_hoc, ...lich_du_kien]
  const xung_dot = []

  for (let vi_tri = 0; vi_tri < tat_ca_lich.length; vi_tri += 1) {
    for (let vi_tri_so_sanh = vi_tri + 1; vi_tri_so_sanh < tat_ca_lich.length; vi_tri_so_sanh += 1) {
      const lich_mot = tat_ca_lich[vi_tri]
      const lich_hai = tat_ca_lich[vi_tri_so_sanh]
      const cung_khung = lich_mot.ngay_hoc === lich_hai.ngay_hoc && lich_mot.ma_tiet_hoc === lich_hai.ma_tiet_hoc

      if (!cung_khung) {
        continue
      }

      if (lich_mot.ma_phong_hoc === lich_hai.ma_phong_hoc) {
        xung_dot.push(tao_muc_xung_dot('trung_phong_hoc', lich_mot, lich_hai))
      }

      if (lich_mot.ma_giao_vien === lich_hai.ma_giao_vien) {
        xung_dot.push(tao_muc_xung_dot('trung_giao_vien', lich_mot, lich_hai))
      }
    }
  }

  return xung_dot
}

function tao_muc_xung_dot(loai_xung_dot, lich_mot, lich_hai) {
  return {
    loai_xung_dot,
    thong_bao: loai_xung_dot === 'trung_phong_hoc' ? 'Trung phong hoc.' : 'Trung giao vien.',
    ngay_hoc: lich_mot.ngay_hoc,
    ma_tiet_hoc: lich_mot.ma_tiet_hoc,
    ma_lich_hoc: [lich_mot.ma_lich_hoc, lich_hai.ma_lich_hoc],
    ma_lop_hoc: [lich_mot.ma_lop_hoc, lich_hai.ma_lop_hoc],
    ma_phong_hoc: lich_mot.ma_phong_hoc === lich_hai.ma_phong_hoc ? lich_mot.ma_phong_hoc : null,
    ma_giao_vien: lich_mot.ma_giao_vien === lich_hai.ma_giao_vien ? lich_mot.ma_giao_vien : null,
  }
}

export function lay_lich_day_ca_nhan(kho_du_lieu, ma_giao_vien) {
  return kho_du_lieu.lich_hoc.filter((lich) => lich.ma_giao_vien === ma_giao_vien)
}

export function them_hoc_vien_vao_lop(kho_du_lieu, ma_lop_hoc, ma_hoc_vien) {
  const da_co = kho_du_lieu.hoc_vien_lop_hoc.some((muc) => muc.ma_lop_hoc === ma_lop_hoc && muc.ma_hoc_vien === ma_hoc_vien)

  if (da_co) {
    return { thanh_cong: false, ma_loi: 409, thong_bao: 'Hoc vien da nam trong lop hoc.' }
  }

  kho_du_lieu.hoc_vien_lop_hoc.push({ ma_lop_hoc, ma_hoc_vien })
  return { thanh_cong: true, ban_ghi: { ma_lop_hoc, ma_hoc_vien } }
}

export function xem_truoc_lich_tu_van_ban(kho_du_lieu, du_lieu_vao) {
  const lich_du_kien = (du_lieu_vao.cac_dong_bang ?? []).map((dong, vi_tri) => ({
    ma_lich_hoc: `du_kien_${vi_tri + 1}`,
    ma_lop_hoc: dong.ma_lop_hoc,
    ma_mon_hoc: dong.ma_mon_hoc,
    ma_giao_vien: dong.ma_giao_vien,
    ma_phong_hoc: dong.ma_phong_hoc,
    ma_tiet_hoc: dong.ma_tiet_hoc,
    ngay_hoc: dong.ngay_hoc,
  }))

  return {
    thanh_cong: true,
    lich_du_kien,
    xung_dot: kiem_tra_trung_lich(kho_du_lieu, lich_du_kien),
  }
}

export function luu_lich_du_kien(kho_du_lieu, lich_du_kien) {
  const xung_dot = kiem_tra_trung_lich(kho_du_lieu, lich_du_kien)

  if (xung_dot.length > 0) {
    return { thanh_cong: false, ma_loi: 409, thong_bao: 'Lich du kien con trung.', xung_dot }
  }

  kho_du_lieu.lich_hoc.push(...lich_du_kien.map((lich) => ({ ...lich, ma_lich_hoc: tao_ma_ngan('lich') })))
  return { thanh_cong: true, so_lich_da_luu: lich_du_kien.length }
}

export function lay_giao_vien_cua_khoa(kho_du_lieu, ma_khoa_ban) {
  return kho_du_lieu.ho_so_giao_vien
    .filter((ho_so) => ho_so.ma_khoa_ban === ma_khoa_ban && !ho_so.da_xoa)
    .map((ho_so) => ({
      ...ho_so,
      nguoi_dung: bo_thong_tin_nhay_cam(kho_du_lieu.nguoi_dung.find((muc) => muc.ma_nguoi_dung === ho_so.ma_giao_vien)),
    }))
}

export function tim_cong_thuc_diem(kho_du_lieu, ma_mon_hoc) {
  return (
    kho_du_lieu.cau_hinh_cong_thuc_diem.find((muc) => muc.ma_mon_hoc === ma_mon_hoc) ??
    kho_du_lieu.cau_hinh_cong_thuc_diem.find((muc) => muc.ma_mon_hoc === 'tat_ca')
  )
}

export function tinh_diem_trung_binh(kho_du_lieu, diem) {
  const cong_thuc = tim_cong_thuc_diem(kho_du_lieu, diem.ma_mon_hoc)
  const tong_trong_so = cong_thuc.thanh_phan.reduce((tong, muc) => tong + muc.trong_so, 0)

  if (Math.abs(tong_trong_so - 1) > 0.001) {
    throw new Error('Cong thuc diem chua du mot tram phan tram trong so.')
  }

  const diem_trung_binh = cong_thuc.thanh_phan.reduce((tong, muc) => {
    const diem_thanh_phan = Number(diem[muc.truong_diem])
    return tong + (Number.isFinite(diem_thanh_phan) ? diem_thanh_phan * muc.trong_so : 0)
  }, 0)

  return Number(diem_trung_binh.toFixed(2))
}

export function lay_bang_diem(kho_du_lieu, ma_lop_hoc, nguoi_dung) {
  return kho_du_lieu.diem_thanh_phan
    .filter((diem) => !ma_lop_hoc || diem.ma_lop_hoc === ma_lop_hoc)
    .filter((diem) => nguoi_dung.ma_vai_tro !== 'hoc_vien' || diem.ma_hoc_vien === nguoi_dung.ma_nguoi_dung)
    .map((diem) => {
      const hoc_vien = kho_du_lieu.nguoi_dung.find((muc) => muc.ma_nguoi_dung === diem.ma_hoc_vien)
      return {
        ...diem,
        ho_va_ten: hoc_vien?.ho_va_ten,
        thu_dien_tu: hoc_vien?.thu_dien_tu,
        diem_trung_binh: tinh_diem_trung_binh(kho_du_lieu, diem),
      }
    })
}

export function sua_diem_thanh_phan(kho_du_lieu, nguoi_dung, ma_diem, truong_diem, gia_tri) {
  const diem = kho_du_lieu.diem_thanh_phan.find((muc) => muc.ma_diem === ma_diem)

  if (!diem) {
    return { thanh_cong: false, ma_loi: 404, thong_bao: 'Khong tim thay ban ghi diem.' }
  }

  const lop_hoc = kho_du_lieu.lop_hoc.find((muc) => muc.ma_lop_hoc === diem.ma_lop_hoc)

  if (nguoi_dung.ma_vai_tro !== 'giao_vien' || lop_hoc?.ma_giao_vien !== nguoi_dung.ma_nguoi_dung) {
    return { thanh_cong: false, ma_loi: 403, thong_bao: 'Chi giao vien dang day lop nay moi duoc sua diem.' }
  }

  if (!tim_cong_thuc_diem(kho_du_lieu, diem.ma_mon_hoc).thanh_phan.some((muc) => muc.truong_diem === truong_diem)) {
    return { thanh_cong: false, ma_loi: 400, thong_bao: 'Truong diem khong nam trong cong thuc duoc cau hinh.' }
  }

  const diem_moi = Number(gia_tri)

  if (!Number.isFinite(diem_moi) || diem_moi < 0 || diem_moi > 10) {
    return { thanh_cong: false, ma_loi: 400, thong_bao: 'Diem phai nam trong khoang tu 0 den 10.' }
  }

  const gia_tri_cu = diem[truong_diem]
  diem[truong_diem] = Number(diem_moi.toFixed(1))
  kho_du_lieu.lich_su_diem.push({
    ma_lich_su_diem: tao_ma_ngan('lsd'),
    ma_diem,
    truong_diem,
    gia_tri_cu,
    gia_tri_moi: diem[truong_diem],
    ma_nguoi_sua: nguoi_dung.ma_nguoi_dung,
    thoi_diem_sua: new Date().toISOString(),
  })

  return {
    thanh_cong: true,
    diem: {
      ...diem,
      diem_trung_binh: tinh_diem_trung_binh(kho_du_lieu, diem),
    },
  }
}

export function xem_truoc_phieu_diem(kho_du_lieu, ma_lop_hoc) {
  const bo_nho_dem = kho_du_lieu.bo_nho_dem_phieu_diem.find((muc) => muc.ma_lop_hoc === ma_lop_hoc)

  if (bo_nho_dem) {
    return { thanh_cong: true, tu_bo_nho_dem: true, noi_dung: bo_nho_dem.noi_dung }
  }

  const noi_dung = tao_noi_dung_van_ban_phieu_diem(kho_du_lieu, ma_lop_hoc)
  kho_du_lieu.bo_nho_dem_phieu_diem.push({ ma_lop_hoc, noi_dung, thoi_diem_tao: new Date().toISOString() })
  return { thanh_cong: true, tu_bo_nho_dem: false, noi_dung }
}

export function xu_ly_nhap_bang_tinh(kho_du_lieu, ma_cau_hinh_nhap, so_lieu_bang_tinh) {
  const cau_hinh = kho_du_lieu.cau_hinh_nhap_bang_tinh.find((muc) => muc.ma_cau_hinh_nhap === ma_cau_hinh_nhap)

  if (!cau_hinh) {
    return { thanh_cong: false, thong_bao: 'Khong tim thay cau hinh nhap bang tinh.' }
  }

  const cot_cau_hinh = kho_du_lieu.cau_hinh_nhap_bang_tinh_cot.filter((muc) => muc.ma_cau_hinh_nhap === ma_cau_hinh_nhap)
  const cac_ban_ghi = []
  const cac_loi = []

  for (const trang of so_lieu_bang_tinh.cac_trang ?? []) {
    if (!khop_mau_ten_trang(cau_hinh, trang.ten_trang)) {
      continue
    }

    const dong_tieu_de = tim_dong_tieu_de(trang.cac_dong, cot_cau_hinh)

    if (dong_tieu_de < 0) {
      cac_loi.push({ ten_trang: trang.ten_trang, thong_bao: 'Khong nhan dien duoc dong tieu de.' })
      continue
    }

    for (let vi_tri = dong_tieu_de + 1; vi_tri < trang.cac_dong.length; vi_tri += 1) {
      const dong = trang.cac_dong[vi_tri]
      const ban_ghi = {}
      const loi_dong = []

      for (const cot of cot_cau_hinh) {
        const gia_tri = dong[doi_cot_bang_tinh_sang_so(cot.cot_bang_tinh)]

        if (cot.bat_buoc && (gia_tri === undefined || gia_tri === null || String(gia_tri).trim() === '')) {
          loi_dong.push(`Thieu ${cot.ten_tieu_de}`)
        }

        ban_ghi[cot.truong_he_thong] = gia_tri
      }

      if (loi_dong.length > 0) {
        cac_loi.push({ ten_trang: trang.ten_trang, dong: vi_tri + 1, loi: loi_dong })
      } else if (Object.values(ban_ghi).some((gia_tri) => gia_tri !== undefined && gia_tri !== null && String(gia_tri).trim() !== '')) {
        cac_ban_ghi.push({ ten_trang: trang.ten_trang, dong: vi_tri + 1, du_lieu: ban_ghi })
      }
    }
  }

  return {
    thanh_cong: cac_loi.length === 0,
    so_ban_ghi_hop_le: cac_ban_ghi.length,
    ban_ghi: cac_ban_ghi,
    loi: cac_loi,
  }
}

function khop_mau_ten_trang(cau_hinh, ten_trang) {
  if (cau_hinh.che_do_khop === 'chinh_xac') {
    return cau_hinh.mau_ten_trang === ten_trang
  }

  const mau = new RegExp(`^${cau_hinh.mau_ten_trang.replaceAll('*', '.*')}$`, 'i')
  return mau.test(ten_trang)
}

function tim_dong_tieu_de(cac_dong, cot_cau_hinh) {
  let vi_tri_tot_nhat = -1
  let diem_tot_nhat = 0

  cac_dong.forEach((dong, vi_tri) => {
    const diem = cot_cau_hinh.reduce((tong, cot) => {
      const co_tieu_de = dong.some((o) => String(o ?? '').trim().toLowerCase() === cot.ten_tieu_de.toLowerCase())
      return tong + (co_tieu_de ? 1 : 0)
    }, 0)

    if (diem > diem_tot_nhat) {
      vi_tri_tot_nhat = vi_tri
      diem_tot_nhat = diem
    }
  })

  return diem_tot_nhat > 0 ? vi_tri_tot_nhat : -1
}

function doi_cot_bang_tinh_sang_so(cot_bang_tinh) {
  return cot_bang_tinh
    .toUpperCase()
    .split('')
    .reduce((tong, ky_tu) => tong * 26 + ky_tu.charCodeAt(0) - 64, 0) - 1
}

export function tao_noi_dung_bang_tinh(kho_du_lieu, loai_danh_sach) {
  if (!cac_loai_danh_sach.includes(loai_danh_sach)) {
    return { thanh_cong: false, thong_bao: 'Loai danh sach khong duoc ho tro.' }
  }

  const du_lieu = kho_du_lieu[loai_danh_sach] ?? []
  const ban_ghi = loai_danh_sach === 'nguoi_dung' ? du_lieu.map(bo_thong_tin_nhay_cam) : du_lieu
  const cac_cot = Array.from(new Set(ban_ghi.flatMap((muc) => Object.keys(muc))))
  const cac_cot_hien_thi = cac_cot.length > 0 ? cac_cot : ['khong_co_du_lieu']
  const noi_dung = [
    cac_cot_hien_thi.join(','),
    ...ban_ghi.map((muc) => cac_cot_hien_thi.map((cot) => lam_sach_o_bang_tinh(muc[cot])).join(',')),
  ].join('\n')

  return { thanh_cong: true, ten_tep: `${loai_danh_sach}.csv`, noi_dung }
}

function lam_sach_o_bang_tinh(gia_tri) {
  if (Array.isArray(gia_tri) || (gia_tri && typeof gia_tri === 'object')) {
    return `"${JSON.stringify(gia_tri).replaceAll('"', '""')}"`
  }

  return `"${String(gia_tri ?? '').replaceAll('"', '""')}"`
}

export function tao_noi_dung_van_ban_phieu_diem(kho_du_lieu, ma_lop_hoc) {
  const lop_hoc = kho_du_lieu.lop_hoc.find((muc) => muc.ma_lop_hoc === ma_lop_hoc)
  const bang_diem = lay_bang_diem(kho_du_lieu, ma_lop_hoc, { ma_vai_tro: 'phong_dao_tao' })
  const dong_bang = bang_diem
    .map((muc) => `<tr><td>${muc.ho_va_ten}</td><td>${muc.ma_hoc_vien}</td><td>${muc.diem_trung_binh}</td></tr>`)
    .join('')

  return `<!doctype html><html><head><meta charset="utf-8"></head><body><h1>Phieu diem ${lop_hoc?.ten_lop_hoc ?? ''}</h1><table border="1"><tr><th>Ho va ten</th><th>Ma hoc vien</th><th>Diem trung binh</th></tr>${dong_bang}</table></body></html>`
}

export function tao_noi_dung_van_ban_lich_hoc(kho_du_lieu) {
  const dong_bang = kho_du_lieu.lich_hoc
    .map((lich) => {
      const lop_hoc = kho_du_lieu.lop_hoc.find((muc) => muc.ma_lop_hoc === lich.ma_lop_hoc)
      const tiet_hoc = kho_du_lieu.tiet_hoc.find((muc) => muc.ma_tiet_hoc === lich.ma_tiet_hoc)
      const phong_hoc = kho_du_lieu.phong_hoc.find((muc) => muc.ma_phong_hoc === lich.ma_phong_hoc)
      return `<tr><td>${lich.ngay_hoc}</td><td>${tiet_hoc?.ten_tiet_hoc ?? ''}</td><td>${lop_hoc?.ten_lop_hoc ?? ''}</td><td>${phong_hoc?.ten_phong_hoc ?? ''}</td></tr>`
    })
    .join('')

  return `<!doctype html><html><head><meta charset="utf-8"></head><body><h1>Lich hoc</h1><table border="1"><tr><th>Ngay hoc</th><th>Tiet hoc</th><th>Lop hoc</th><th>Phong hoc</th></tr>${dong_bang}</table></body></html>`
}

export function luu_thong_tin_tep(kho_du_lieu, nguoi_dung, thong_tin_tep, loai_tep, gioi_han_byte, cac_duoi_hop_le) {
  const duoi_tep = thong_tin_tep.ten_tep?.split('.').pop()?.toLowerCase()
  const dung_luong_byte = tinh_dung_luong_tu_chuoi_ma_hoa(thong_tin_tep.du_lieu_ma_hoa ?? '')

  if (!cac_duoi_hop_le.includes(duoi_tep)) {
    return { thanh_cong: false, ma_loi: 400, thong_bao: 'Dinh dang tep khong hop le.' }
  }

  if (dung_luong_byte > gioi_han_byte) {
    return { thanh_cong: false, ma_loi: 400, thong_bao: 'Dung luong tep vuot gioi han cho phep.' }
  }

  const tep_tin = {
    ma_tep_tin: tao_ma_ngan('tep'),
    ten_tep: thong_tin_tep.ten_tep,
    loai_tep,
    dung_luong_byte,
    ma_nguoi_tai: nguoi_dung.ma_nguoi_dung,
    thoi_diem_tai: new Date().toISOString(),
  }
  kho_du_lieu.tep_tin.push(tep_tin)

  return { thanh_cong: true, tep_tin }
}

function tinh_dung_luong_tu_chuoi_ma_hoa(chuoi_ma_hoa) {
  const phan_du_lieu = chuoi_ma_hoa.includes(',') ? chuoi_ma_hoa.split(',').pop() : chuoi_ma_hoa
  return Math.floor((phan_du_lieu.length * 3) / 4)
}

export function luu_phu_luc_hoi_dong(kho_du_lieu, thong_tin_tep) {
  const ban_ghi = {
    ma_tep_phu_luc: tao_ma_ngan('pl'),
    loai_phu_luc: thong_tin_tep.loai_phu_luc,
    ma_lop_hoc: thong_tin_tep.ma_lop_hoc,
    ten_tep: thong_tin_tep.ten_tep,
    dung_luong_byte: tinh_dung_luong_tu_chuoi_ma_hoa(thong_tin_tep.du_lieu_ma_hoa ?? ''),
    dang_bat: true,
    da_xoa: false,
  }
  kho_du_lieu.tep_phu_luc_hoi_dong.push(ban_ghi)
  return { thanh_cong: true, ban_ghi }
}

export function doi_trang_thai_phu_luc(kho_du_lieu, ma_tep_phu_luc, dang_bat) {
  return cap_nhat_ban_ghi(kho_du_lieu, 'tep_phu_luc_hoi_dong', ma_tep_phu_luc, { dang_bat })
}

export function phan_quyen_tai_lieu(kho_du_lieu, ma_tep_tin, cac_vai_tro) {
  kho_du_lieu.quyen_xem_tai_lieu = kho_du_lieu.quyen_xem_tai_lieu.filter((muc) => muc.ma_tep_tin !== ma_tep_tin)
  kho_du_lieu.quyen_xem_tai_lieu.push(...cac_vai_tro.map((ma_vai_tro) => ({ ma_tep_tin, ma_vai_tro })))
  return { thanh_cong: true, quyen_xem_tai_lieu: kho_du_lieu.quyen_xem_tai_lieu.filter((muc) => muc.ma_tep_tin === ma_tep_tin) }
}

export function xem_truc_tiep_tai_lieu(kho_du_lieu, nguoi_dung, ma_tep_tin) {
  const duoc_xem = kho_du_lieu.quyen_xem_tai_lieu.some((muc) => muc.ma_tep_tin === ma_tep_tin && muc.ma_vai_tro === nguoi_dung.ma_vai_tro)

  if (!duoc_xem) {
    return { thanh_cong: false, ma_loi: 403, thong_bao: 'Vai tro hien tai khong duoc xem tai lieu nay.' }
  }

  const tep_tin = kho_du_lieu.tep_tin.find((muc) => muc.ma_tep_tin === ma_tep_tin)
  return { thanh_cong: true, tep_tin, noi_dung_xem_truoc: `Xem truc tiep tai lieu ${tep_tin?.ten_tep ?? ''}` }
}

export function ghi_ket_qua_quet_the(kho_du_lieu, du_lieu_vao) {
  const ket_qua = {
    ma_ket_qua_quet: tao_ma_ngan('quet'),
    ho_va_ten: du_lieu_vao.ho_va_ten,
    so_can_cuoc: du_lieu_vao.so_can_cuoc,
    ngay_sinh: du_lieu_vao.ngay_sinh,
    que_quan: du_lieu_vao.que_quan,
    thoi_diem_quet: new Date().toISOString(),
  }
  kho_du_lieu.ket_qua_quet_the.push(ket_qua)
  return { thanh_cong: true, ket_qua }
}

export function lay_thong_ke_bang_dieu_khien(kho_du_lieu) {
  return {
    tong_hoc_vien: kho_du_lieu.nguoi_dung.filter((muc) => muc.ma_vai_tro === 'hoc_vien' && !muc.da_xoa).length,
    tong_lop_hoc: kho_du_lieu.lop_hoc.filter((muc) => !muc.da_xoa).length,
    tong_giao_vien: kho_du_lieu.nguoi_dung.filter((muc) => muc.ma_vai_tro === 'giao_vien' && !muc.da_xoa).length,
    tong_phong_hoc: kho_du_lieu.phong_hoc.length,
    bieu_do_dang_ky: [
      { nhan: 'Thu 2', so_luong: 24 },
      { nhan: 'Thu 3', so_luong: 31 },
      { nhan: 'Thu 4', so_luong: 28 },
      { nhan: 'Thu 5', so_luong: 42 },
      { nhan: 'Thu 6', so_luong: 36 },
    ],
    bieu_do_vai_tro: kho_du_lieu.vai_tro.map((vai_tro) => ({
      ten_vai_tro: vai_tro.ten_vai_tro,
      so_luong: kho_du_lieu.nguoi_dung.filter((muc) => muc.ma_vai_tro === vai_tro.ma_vai_tro && !muc.da_xoa).length,
    })),
  }
}
