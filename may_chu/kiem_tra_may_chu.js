import goi_kiem_tra from 'node:test'
import goi_xac_nhan from 'node:assert/strict'
import { tao_kho_du_lieu } from './du_lieu_mau.js'
import {
  cac_loai_danh_sach,
  doi_trang_thai_phu_luc,
  kiem_tra_tiet_hoc_hop_le,
  kiem_tra_trung_lich,
  lay_bang_diem,
  lay_giao_vien_cua_khoa,
  lay_lich_day_ca_nhan,
  phan_quyen_tai_lieu,
  sua_diem_thanh_phan,
  tao_noi_dung_bang_tinh,
  them_hoc_vien_vao_lop,
  xac_thuc_bang_mat_khau,
  xem_truc_tiep_tai_lieu,
  xem_truoc_lich_tu_van_ban,
  xem_truoc_phieu_diem,
  xoa_mem_ban_ghi,
  xu_ly_nhap_bang_tinh,
} from './quy_tac_nghiep_vu.js'

goi_kiem_tra('dang nhap bang thu dien tu va mat khau hop le', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const ket_qua = xac_thuc_bang_mat_khau(kho_du_lieu, 'khoa@dao-tao.vn', 'Matkhau@123')

  goi_xac_nhan.equal(ket_qua.thanh_cong, true)
  goi_xac_nhan.equal(ket_qua.nguoi_dung.ma_vai_tro, 'giao_vien')
  goi_xac_nhan.equal(ket_qua.duong_dan_sau_dang_nhap, '/lich-day-ca-nhan')
})

goi_kiem_tra('thuat toan phat hien trung lich theo phong hoc va giao vien', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const xung_dot = kiem_tra_trung_lich(kho_du_lieu)

  goi_xac_nhan.ok(xung_dot.some((muc) => muc.loai_xung_dot === 'trung_phong_hoc'))
  goi_xac_nhan.ok(xung_dot.some((muc) => muc.loai_xung_dot === 'trung_giao_vien'))
})

goi_kiem_tra('kiem tra tiet hoc chan sai gio va trung gio', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const sai_gio = kiem_tra_tiet_hoc_hop_le(kho_du_lieu, {
    ma_tiet_hoc: 'tiet_moi',
    thoi_gian_bat_dau: '10:00',
    thoi_gian_ket_thuc: '08:00',
  })
  const trung_gio = kiem_tra_tiet_hoc_hop_le(kho_du_lieu, {
    ma_tiet_hoc: 'tiet_moi',
    thoi_gian_bat_dau: '10:00',
    thoi_gian_ket_thuc: '11:30',
  })

  goi_xac_nhan.equal(sai_gio.hop_le, false)
  goi_xac_nhan.equal(trung_gio.hop_le, false)
})

goi_kiem_tra('tinh diem trung binh theo cong thuc cau hinh', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const bang_diem = lay_bang_diem(kho_du_lieu, 'lop_pm_01', { ma_vai_tro: 'phong_dao_tao' })

  goi_xac_nhan.equal(bang_diem[0].diem_trung_binh, 8.52)
})

goi_kiem_tra('chi giao vien dang day lop duoc sua diem va ghi lich su', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const giao_vien_dung = kho_du_lieu.nguoi_dung.find((muc) => muc.ma_nguoi_dung === 'nd_giao_vien_01')
  const giao_vien_sai = kho_du_lieu.nguoi_dung.find((muc) => muc.ma_nguoi_dung === 'nd_giao_vien_02')

  const bi_chan = sua_diem_thanh_phan(kho_du_lieu, giao_vien_sai, 'diem_001', 'diem_thuc_hanh_1', 9.1)
  const duoc_sua = sua_diem_thanh_phan(kho_du_lieu, giao_vien_dung, 'diem_001', 'diem_thuc_hanh_1', 9.1)

  goi_xac_nhan.equal(bi_chan.thanh_cong, false)
  goi_xac_nhan.equal(duoc_sua.thanh_cong, true)
  goi_xac_nhan.equal(kho_du_lieu.lich_su_diem.length, 1)
})

goi_kiem_tra('nhap bang tinh nhieu trang bang mapping dong', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const ket_qua = xu_ly_nhap_bang_tinh(kho_du_lieu, 'nhap_bang_diem', {
    cac_trang: [
      {
        ten_trang: 'diem_lop_pm_01',
        cac_dong: [
          ['Ghi chu', '', '', '', '', ''],
          ['Ma sinh vien', 'Ho ten', 'Diem thuc hanh 1', 'Cot phu', 'Cot phu', 'Diem cuoi ky'],
          ['nd_hoc_vien_01', 'Le Minh Manh', 8.5, '', '', 8.4],
        ],
      },
      {
        ten_trang: 'khong_lien_quan',
        cac_dong: [['Ma sinh vien', 'Diem thuc hanh 1']],
      },
    ],
  })

  goi_xac_nhan.equal(ket_qua.thanh_cong, true)
  goi_xac_nhan.equal(ket_qua.so_ban_ghi_hop_le, 1)
  goi_xac_nhan.equal(ket_qua.ban_ghi[0].du_lieu.diem_thi_cuoi_ky, 8.4)
})

goi_kiem_tra('xu ly ho so lop khoa va lich day ca nhan', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const giao_vien = lay_giao_vien_cua_khoa(kho_du_lieu, 'khoa_cong_nghe')
  const lich_day = lay_lich_day_ca_nhan(kho_du_lieu, 'nd_giao_vien_01')
  const them_lop = them_hoc_vien_vao_lop(kho_du_lieu, 'lop_gt_01', 'nd_hoc_vien_02')

  goi_xac_nhan.equal(giao_vien.length, 1)
  goi_xac_nhan.ok(lich_day.length >= 2)
  goi_xac_nhan.equal(them_lop.thanh_cong, true)
})

goi_kiem_tra('xem truoc lich tu van ban va chan trung truoc khi luu', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const ket_qua = xem_truoc_lich_tu_van_ban(kho_du_lieu, {
    cac_dong_bang: [
      {
        ma_lop_hoc: 'lop_pm_01',
        ma_mon_hoc: 'mon_lap_trinh_co_so',
        ma_giao_vien: 'nd_giao_vien_01',
        ma_phong_hoc: 'phong_a201',
        ma_tiet_hoc: 'tiet_02',
        ngay_hoc: '2026-06-01',
      },
    ],
  })

  goi_xac_nhan.equal(ket_qua.thanh_cong, true)
  goi_xac_nhan.ok(ket_qua.xung_dot.length > 0)
})

goi_kiem_tra('phieu diem co bo nho dem', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const lan_dau = xem_truoc_phieu_diem(kho_du_lieu, 'lop_pm_01')
  const lan_sau = xem_truoc_phieu_diem(kho_du_lieu, 'lop_pm_01')

  goi_xac_nhan.equal(lan_dau.tu_bo_nho_dem, false)
  goi_xac_nhan.equal(lan_sau.tu_bo_nho_dem, true)
})

goi_kiem_tra('phu luc hoi dong co the bat tat trang thai', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const ket_qua = doi_trang_thai_phu_luc(kho_du_lieu, 'pl_001', false)

  goi_xac_nhan.equal(ket_qua.thanh_cong, true)
  goi_xac_nhan.equal(ket_qua.ban_ghi.dang_bat, false)
})

goi_kiem_tra('phan quyen tai lieu chan hoc vien khi chua duoc cap', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const hoc_vien = kho_du_lieu.nguoi_dung.find((muc) => muc.ma_nguoi_dung === 'nd_hoc_vien_01')
  const bi_chan = xem_truc_tiep_tai_lieu(kho_du_lieu, hoc_vien, 'tep_001')
  phan_quyen_tai_lieu(kho_du_lieu, 'tep_001', ['hoc_vien'])
  const duoc_xem = xem_truc_tiep_tai_lieu(kho_du_lieu, hoc_vien, 'tep_001')

  goi_xac_nhan.equal(bi_chan.thanh_cong, false)
  goi_xac_nhan.equal(duoc_xem.thanh_cong, true)
})

goi_kiem_tra('xoa mem ban ghi khong hien trong danh sach', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  const ket_qua = xoa_mem_ban_ghi(kho_du_lieu, 'lop_hoc', 'lop_gt_01')

  goi_xac_nhan.equal(ket_qua.thanh_cong, true)
  goi_xac_nhan.equal(kho_du_lieu.lop_hoc.find((muc) => muc.ma_lop_hoc === 'lop_gt_01').da_xoa, true)
})

goi_kiem_tra('xuat du lieu ho tro it nhat muoi sau loai danh sach', () => {
  const kho_du_lieu = tao_kho_du_lieu()
  goi_xac_nhan.ok(cac_loai_danh_sach.length >= 16)

  for (const loai_danh_sach of cac_loai_danh_sach) {
    const ket_qua = tao_noi_dung_bang_tinh(kho_du_lieu, loai_danh_sach)
    goi_xac_nhan.equal(ket_qua.thanh_cong, true)
    goi_xac_nhan.ok(ket_qua.noi_dung.length > 0)
  }
})
