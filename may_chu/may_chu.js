import goi_http from 'node:http'
import { fileURLToPath as doi_duong_dan_tep } from 'node:url'
import { tao_kho_du_lieu } from './du_lieu_mau.js'
import {
  cap_nhat_ban_ghi,
  doi_trang_thai_phu_luc,
  ghi_ket_qua_quet_the,
  kiem_tra_quyen,
  kiem_tra_tiet_hoc_hop_le,
  kiem_tra_trung_lich,
  khoi_phuc_ban_ghi,
  lay_bang_diem,
  lay_giao_vien_cua_khoa,
  lay_lich_day_ca_nhan,
  lay_thong_ke_bang_dieu_khien,
  liet_ke_bang,
  luu_lich_du_kien,
  luu_phu_luc_hoi_dong,
  luu_thong_tin_tep,
  phan_quyen_tai_lieu,
  sua_diem_thanh_phan,
  tao_ban_ghi,
  tao_noi_dung_bang_tinh,
  tao_noi_dung_van_ban_lich_hoc,
  tao_noi_dung_van_ban_phieu_diem,
  them_hoc_vien_vao_lop,
  tim_nguoi_dung_theo_phien,
  xac_thuc_bang_mat_khau,
  xac_thuc_ben_ngoai,
  xem_truc_tiep_tai_lieu,
  xem_truoc_lich_tu_van_ban,
  xem_truoc_phieu_diem,
  xoa_mem_ban_ghi,
  xoa_vinh_vien_ban_ghi,
  xu_ly_nhap_bang_tinh,
} from './quy_tac_nghiep_vu.js'

export const kho_du_lieu = tao_kho_du_lieu()
const nguoi_nghe_tin_nhan = new Set()

function gui_json(phan_hoi, ma_trang_thai, du_lieu) {
  phan_hoi.writeHead(ma_trang_thai, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type, ma-phien',
    'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  })
  phan_hoi.end(JSON.stringify(du_lieu))
}

function gui_tep(phan_hoi, ten_tep, noi_dung, loai_noi_dung) {
  phan_hoi.writeHead(200, {
    'content-type': `${loai_noi_dung}; charset=utf-8`,
    'content-disposition': `attachment; filename="${encodeURIComponent(ten_tep)}"`,
    'access-control-allow-origin': '*',
  })
  phan_hoi.end(noi_dung)
}

function lay_ma_phien(yeu_cau) {
  return yeu_cau.headers['ma-phien'] || ''
}

async function doc_than_yeu_cau(yeu_cau) {
  const cac_manh = []

  for await (const manh of yeu_cau) {
    cac_manh.push(manh)
  }

  const noi_dung = Buffer.concat(cac_manh).toString('utf8')

  if (!noi_dung) {
    return {}
  }

  try {
    return JSON.parse(noi_dung)
  } catch {
    return { _loi_doc_du_lieu: 'Than yeu cau phai la du lieu hop le.' }
  }
}

function tao_ngu_canh(yeu_cau, phan_hoi, du_lieu_vao, tham_so) {
  const nguoi_dung = tim_nguoi_dung_theo_phien(kho_du_lieu, lay_ma_phien(yeu_cau))
  return {
    yeu_cau,
    phan_hoi,
    du_lieu_vao,
    tham_so,
    nguoi_dung,
    tra_loi: (ma_trang_thai, du_lieu) => gui_json(phan_hoi, ma_trang_thai, du_lieu),
    tra_tep: (ten_tep, noi_dung, loai_noi_dung) => gui_tep(phan_hoi, ten_tep, noi_dung, loai_noi_dung),
  }
}

const dinh_tuyen = [
  {
    cach: 'POST',
    duong_dan: '/api/dang-nhap',
    xu_ly: async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = xac_thuc_bang_mat_khau(kho_du_lieu, du_lieu_vao.thu_dien_tu, du_lieu_vao.mat_khau)
      return tra_loi(ket_qua.thanh_cong ? 200 : 401, ket_qua)
    },
  },
  {
    cach: 'POST',
    duong_dan: '/api/dang-nhap-ben-ngoai',
    xu_ly: async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = xac_thuc_ben_ngoai(kho_du_lieu, du_lieu_vao.ma_dang_nhap_ngoai, du_lieu_vao.thu_dien_tu, du_lieu_vao.ho_va_ten)
      return tra_loi(200, ket_qua)
    },
  },
  {
    cach: 'GET',
    duong_dan: '/api/thong-ke-bang-dieu-khien',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'xem_bang_dieu_khien', async ({ tra_loi }) =>
      tra_loi(200, { thanh_cong: true, du_lieu: lay_thong_ke_bang_dieu_khien(kho_du_lieu) }),
    ),
  },
  {
    cach: 'GET',
    duong_dan: '/api/danh-muc',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_danh_muc', async ({ tham_so, tra_loi }) => {
      const ket_qua = liet_ke_bang(kho_du_lieu, tham_so.get('ten_bang'))
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/danh-muc',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_danh_muc', async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = tao_ban_ghi(kho_du_lieu, du_lieu_vao.ten_bang, du_lieu_vao.du_lieu)
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'PATCH',
    duong_dan: '/api/danh-muc',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_danh_muc', async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = cap_nhat_ban_ghi(kho_du_lieu, du_lieu_vao.ten_bang, du_lieu_vao.ma_ban_ghi, du_lieu_vao.du_lieu)
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/xoa-mem-ban-ghi',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_danh_muc', async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = xoa_mem_ban_ghi(kho_du_lieu, du_lieu_vao.ten_bang, du_lieu_vao.ma_ban_ghi)
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/khoi-phuc-ban-ghi',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_danh_muc', async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = khoi_phuc_ban_ghi(kho_du_lieu, du_lieu_vao.ten_bang, du_lieu_vao.ma_ban_ghi)
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'DELETE',
    duong_dan: '/api/xoa-vinh-vien-ban-ghi',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_danh_muc', async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = xoa_vinh_vien_ban_ghi(kho_du_lieu, du_lieu_vao.ten_bang, du_lieu_vao.ma_ban_ghi)
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'GET',
    duong_dan: '/api/giao-vien-cua-khoa',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_ho_so', async ({ tham_so, tra_loi }) =>
      tra_loi(200, { thanh_cong: true, giao_vien: lay_giao_vien_cua_khoa(kho_du_lieu, tham_so.get('ma_khoa_ban')) }),
    ),
  },
  {
    cach: 'POST',
    duong_dan: '/api/kiem-tra-tiet-hoc',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_danh_muc', async ({ du_lieu_vao, tra_loi }) =>
      tra_loi(200, { thanh_cong: true, ket_qua: kiem_tra_tiet_hoc_hop_le(kho_du_lieu, du_lieu_vao) }),
    ),
  },
  {
    cach: 'POST',
    duong_dan: '/api/them-hoc-vien-vao-lop',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_ho_so', async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = them_hoc_vien_vao_lop(kho_du_lieu, du_lieu_vao.ma_lop_hoc, du_lieu_vao.ma_hoc_vien)
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'GET',
    duong_dan: '/api/lich-day-ca-nhan',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'xem_lich_hoc', async ({ nguoi_dung, tra_loi }) =>
      tra_loi(200, { thanh_cong: true, lich_day: lay_lich_day_ca_nhan(kho_du_lieu, nguoi_dung.ma_nguoi_dung) }),
    ),
  },
  {
    cach: 'POST',
    duong_dan: '/api/kiem-tra-trung-lich',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'kiem_tra_trung_lich', async ({ du_lieu_vao, tra_loi }) =>
      tra_loi(200, { thanh_cong: true, xung_dot: kiem_tra_trung_lich(kho_du_lieu, du_lieu_vao.lich_du_kien ?? []) }),
    ),
  },
  {
    cach: 'POST',
    duong_dan: '/api/nhap-lich-van-ban',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'nhap_lich_van_ban', async ({ du_lieu_vao, tra_loi }) =>
      tra_loi(200, xem_truoc_lich_tu_van_ban(kho_du_lieu, du_lieu_vao)),
    ),
  },
  {
    cach: 'POST',
    duong_dan: '/api/luu-lich-du-kien',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'nhap_lich_van_ban', async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = luu_lich_du_kien(kho_du_lieu, du_lieu_vao.lich_du_kien ?? [])
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'GET',
    duong_dan: '/api/diem-trung-binh',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'xem_diem', async ({ tham_so, nguoi_dung, tra_loi }) =>
      tra_loi(200, { thanh_cong: true, bang_diem: lay_bang_diem(kho_du_lieu, tham_so.get('ma_lop_hoc'), nguoi_dung) }),
    ),
  },
  {
    cach: 'PATCH',
    duong_dan: '/api/sua-diem',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'sua_diem', async ({ du_lieu_vao, nguoi_dung, tra_loi }) => {
      const ket_qua = sua_diem_thanh_phan(kho_du_lieu, nguoi_dung, du_lieu_vao.ma_diem, du_lieu_vao.truong_diem, du_lieu_vao.gia_tri)
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'GET',
    duong_dan: '/api/xem-truoc-phieu-diem',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'xem_diem', async ({ tham_so, tra_loi }) =>
      tra_loi(200, xem_truoc_phieu_diem(kho_du_lieu, tham_so.get('ma_lop_hoc'))),
    ),
  },
  {
    cach: 'POST',
    duong_dan: '/api/nhap-bang-tinh',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'cau_hinh_nhap_bang_tinh', async ({ du_lieu_vao, tra_loi }) =>
      tra_loi(200, xu_ly_nhap_bang_tinh(kho_du_lieu, du_lieu_vao.ma_cau_hinh_nhap, du_lieu_vao.so_lieu_bang_tinh)),
    ),
  },
  {
    cach: 'GET',
    duong_dan: '/api/xuat-danh-sach',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'xuat_du_lieu', async ({ tham_so, tra_loi, tra_tep }) => {
      const ket_qua = tao_noi_dung_bang_tinh(kho_du_lieu, tham_so.get('loai_danh_sach'))

      if (!ket_qua.thanh_cong) {
        return tra_loi(400, ket_qua)
      }

      return tra_tep(ket_qua.ten_tep, ket_qua.noi_dung, 'text/csv')
    }),
  },
  {
    cach: 'GET',
    duong_dan: '/api/xuat-phieu-diem-van-ban',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'xuat_du_lieu', async ({ tham_so, tra_tep }) =>
      tra_tep('phieu_diem.doc', tao_noi_dung_van_ban_phieu_diem(kho_du_lieu, tham_so.get('ma_lop_hoc')), 'application/msword'),
    ),
  },
  {
    cach: 'GET',
    duong_dan: '/api/xuat-lich-hoc-van-ban',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'xuat_du_lieu', async ({ tra_tep }) =>
      tra_tep('lich_hoc.doc', tao_noi_dung_van_ban_lich_hoc(kho_du_lieu), 'application/msword'),
    ),
  },
  {
    cach: 'POST',
    duong_dan: '/api/tai-tep-khao-thi',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'tai_tep_khao_thi', async ({ du_lieu_vao, nguoi_dung, tra_loi }) => {
      const ket_qua = luu_thong_tin_tep(kho_du_lieu, nguoi_dung, du_lieu_vao, 'tep_khao_thi', 50 * 1024 * 1024, ['pdf', 'doc', 'docx'])
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/tai-anh-can-cuoc',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'tai_tep_khao_thi', async ({ du_lieu_vao, nguoi_dung, tra_loi }) => {
      const ket_qua = luu_thong_tin_tep(kho_du_lieu, nguoi_dung, du_lieu_vao, 'anh_can_cuoc_cong_dan', 10 * 1024 * 1024, ['jpg', 'jpeg', 'png', 'webp'])
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/tai-anh-the-giao-vien',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'tai_tep_khao_thi', async ({ du_lieu_vao, nguoi_dung, tra_loi }) => {
      const ket_qua = luu_thong_tin_tep(kho_du_lieu, nguoi_dung, du_lieu_vao, 'anh_the_giao_vien', 10 * 1024 * 1024, ['jpg', 'jpeg', 'png', 'webp'])
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/tai-phu-luc-hoi-dong',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_phu_luc', async ({ du_lieu_vao, tra_loi }) =>
      tra_loi(200, luu_phu_luc_hoi_dong(kho_du_lieu, du_lieu_vao)),
    ),
  },
  {
    cach: 'PATCH',
    duong_dan: '/api/bat-tat-phu-luc-hoi-dong',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_phu_luc', async ({ du_lieu_vao, tra_loi }) => {
      const ket_qua = doi_trang_thai_phu_luc(kho_du_lieu, du_lieu_vao.ma_tep_phu_luc, du_lieu_vao.dang_bat)
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/phan-quyen-tai-lieu',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'phan_quyen_tai_lieu', async ({ du_lieu_vao, tra_loi }) =>
      tra_loi(200, phan_quyen_tai_lieu(kho_du_lieu, du_lieu_vao.ma_tep_tin, du_lieu_vao.cac_vai_tro ?? [])),
    ),
  },
  {
    cach: 'GET',
    duong_dan: '/api/xem-truc-tiep-tai-lieu',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'xem_bang_dieu_khien', async ({ tham_so, nguoi_dung, tra_loi }) => {
      const ket_qua = xem_truc_tiep_tai_lieu(kho_du_lieu, nguoi_dung, tham_so.get('ma_tep_tin'))
      return tra_loi(ket_qua.thanh_cong ? 200 : ket_qua.ma_loi, ket_qua)
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/quet-the-can-cuoc',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'quan_ly_ho_so', async ({ du_lieu_vao, tra_loi }) =>
      tra_loi(200, ghi_ket_qua_quet_the(kho_du_lieu, du_lieu_vao)),
    ),
  },
  {
    cach: 'GET',
    duong_dan: '/api/tin-nhan',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'nhan_tin', async ({ tham_so, tra_loi }) => {
      const ma_cuoc_hoi_thoai = tham_so.get('ma_cuoc_hoi_thoai')
      const tin_nhan = kho_du_lieu.tin_nhan.filter((muc) => muc.ma_cuoc_hoi_thoai === ma_cuoc_hoi_thoai)
      return tra_loi(200, { thanh_cong: true, tin_nhan })
    }),
  },
  {
    cach: 'POST',
    duong_dan: '/api/gui-tin-nhan',
    xu_ly: kiem_tra_quyen(kho_du_lieu, 'nhan_tin', async ({ du_lieu_vao, nguoi_dung, tra_loi }) => {
      const tin_nhan = {
        ma_tin_nhan: `tin_${Date.now()}`,
        ma_cuoc_hoi_thoai: du_lieu_vao.ma_cuoc_hoi_thoai,
        ma_nguoi_gui: nguoi_dung.ma_nguoi_dung,
        noi_dung: du_lieu_vao.noi_dung,
        thoi_diem_gui: new Date().toISOString(),
      }
      kho_du_lieu.tin_nhan.push(tin_nhan)
      phat_tin_nhan(tin_nhan)
      return tra_loi(200, { thanh_cong: true, tin_nhan })
    }),
  },
]

function phat_tin_nhan(tin_nhan) {
  for (const nguoi_nghe of nguoi_nghe_tin_nhan) {
    nguoi_nghe.write(`data: ${JSON.stringify(tin_nhan)}\n\n`)
  }
}

async function xu_ly_yeu_cau(yeu_cau, phan_hoi) {
  if (yeu_cau.method === 'OPTIONS') {
    return gui_json(phan_hoi, 204, {})
  }

  const dia_chi = new URL(yeu_cau.url, 'http://may-chu-noi-bo')

  if (yeu_cau.method === 'GET' && dia_chi.pathname === '/api/luong-tin-nhan') {
    phan_hoi.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'access-control-allow-origin': '*',
    })
    nguoi_nghe_tin_nhan.add(phan_hoi)
    yeu_cau.on('close', () => nguoi_nghe_tin_nhan.delete(phan_hoi))
    return undefined
  }

  const tuyen = dinh_tuyen.find((muc) => muc.cach === yeu_cau.method && muc.duong_dan === dia_chi.pathname)

  if (!tuyen) {
    return gui_json(phan_hoi, 404, { thanh_cong: false, thong_bao: 'Khong tim thay duong dan API.' })
  }

  const du_lieu_vao = await doc_than_yeu_cau(yeu_cau)

  if (du_lieu_vao._loi_doc_du_lieu) {
    return gui_json(phan_hoi, 400, { thanh_cong: false, thong_bao: du_lieu_vao._loi_doc_du_lieu })
  }

  const ngu_canh = tao_ngu_canh(yeu_cau, phan_hoi, du_lieu_vao, dia_chi.searchParams)

  try {
    return await tuyen.xu_ly(ngu_canh)
  } catch (loi) {
    return gui_json(phan_hoi, 500, { thanh_cong: false, thong_bao: loi.message })
  }
}

export function khoi_dong_may_chu(cong = Number(process.env.CONG_MAY_CHU ?? 4000)) {
  const may_chu = goi_http.createServer(xu_ly_yeu_cau)
  may_chu.listen(cong, () => {
    console.log(`May chu Quan ly Dao tao dang chay tai http://127.0.0.1:${cong}`)
  })
  return may_chu
}

if (doi_duong_dan_tep(import.meta.url) === process.argv[1]) {
  khoi_dong_may_chu()
}
