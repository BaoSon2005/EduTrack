CREATE TABLE vai_tro (
  ma_vai_tro TEXT PRIMARY KEY,
  ten_vai_tro TEXT NOT NULL,
  mo_ta TEXT
);

CREATE TABLE quyen_han (
  ma_quyen_han TEXT PRIMARY KEY,
  ten_quyen_han TEXT NOT NULL,
  duong_dan TEXT NOT NULL
);

CREATE TABLE vai_tro_quyen_han (
  ma_vai_tro TEXT NOT NULL REFERENCES vai_tro(ma_vai_tro),
  ma_quyen_han TEXT NOT NULL REFERENCES quyen_han(ma_quyen_han),
  PRIMARY KEY (ma_vai_tro, ma_quyen_han)
);

CREATE TABLE nguoi_dung (
  ma_nguoi_dung TEXT PRIMARY KEY,
  ho_va_ten TEXT NOT NULL,
  thu_dien_tu TEXT NOT NULL UNIQUE,
  muoi_mat_khau TEXT NOT NULL,
  mat_khau_da_bam TEXT NOT NULL,
  ma_vai_tro TEXT NOT NULL REFERENCES vai_tro(ma_vai_tro),
  ma_dang_nhap_ngoai TEXT UNIQUE,
  da_xoa INTEGER NOT NULL DEFAULT 0,
  thoi_diem_xoa TEXT,
  thoi_diem_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  thoi_diem_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phong_ban (
  ma_phong_ban TEXT PRIMARY KEY,
  ten_phong_ban TEXT NOT NULL,
  mo_ta TEXT,
  da_xoa INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE khoa_ban (
  ma_khoa_ban TEXT PRIMARY KEY,
  ten_khoa_ban TEXT NOT NULL,
  ma_phong_ban TEXT NOT NULL REFERENCES phong_ban(ma_phong_ban),
  da_xoa INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE doi_tuong_dao_tao (
  ma_doi_tuong_dao_tao TEXT PRIMARY KEY,
  ten_doi_tuong_dao_tao TEXT NOT NULL,
  bac_dao_tao TEXT NOT NULL,
  da_xoa INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE khoa_hoc (
  ma_khoa_hoc TEXT PRIMARY KEY,
  ten_khoa_hoc TEXT NOT NULL,
  nam_bat_dau INTEGER NOT NULL,
  nam_ket_thuc INTEGER NOT NULL
);

CREATE TABLE nganh_hoc (
  ma_nganh_hoc TEXT PRIMARY KEY,
  ten_nganh_hoc TEXT NOT NULL,
  ma_khoa_hoc TEXT NOT NULL REFERENCES khoa_hoc(ma_khoa_hoc),
  ma_doi_tuong_dao_tao TEXT NOT NULL REFERENCES doi_tuong_dao_tao(ma_doi_tuong_dao_tao),
  ma_khoa_ban TEXT NOT NULL REFERENCES khoa_ban(ma_khoa_ban),
  tieu_chuan TEXT
);

CREATE TABLE mon_hoc (
  ma_mon_hoc TEXT PRIMARY KEY,
  ten_mon_hoc TEXT NOT NULL,
  so_tin_chi INTEGER NOT NULL,
  so_buoi_hoc INTEGER NOT NULL,
  loai_mon_hoc TEXT NOT NULL,
  ma_nganh_hoc TEXT NOT NULL REFERENCES nganh_hoc(ma_nganh_hoc)
);

CREATE TABLE phong_hoc (
  ma_phong_hoc TEXT PRIMARY KEY,
  ten_phong_hoc TEXT NOT NULL,
  suc_chua INTEGER NOT NULL,
  loai_phong TEXT NOT NULL,
  trang_thai TEXT NOT NULL
);

CREATE TABLE lop_hoc (
  ma_lop_hoc TEXT PRIMARY KEY,
  ten_lop_hoc TEXT NOT NULL,
  ma_mon_hoc TEXT NOT NULL REFERENCES mon_hoc(ma_mon_hoc),
  ma_nganh_hoc TEXT NOT NULL REFERENCES nganh_hoc(ma_nganh_hoc),
  ma_giao_vien TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  trang_thai TEXT NOT NULL,
  da_xoa INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE hoc_vien_lop_hoc (
  ma_lop_hoc TEXT NOT NULL REFERENCES lop_hoc(ma_lop_hoc),
  ma_hoc_vien TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  PRIMARY KEY (ma_lop_hoc, ma_hoc_vien)
);

CREATE TABLE ho_so_hoc_vien (
  ma_hoc_vien TEXT PRIMARY KEY REFERENCES nguoi_dung(ma_nguoi_dung),
  so_can_cuoc TEXT NOT NULL UNIQUE,
  ngay_sinh TEXT NOT NULL,
  que_quan TEXT,
  don_vi TEXT,
  trang_thai_hoc_tap TEXT NOT NULL,
  ma_tep_anh_can_cuoc TEXT,
  da_xoa INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE ho_so_giao_vien (
  ma_giao_vien TEXT PRIMARY KEY REFERENCES nguoi_dung(ma_nguoi_dung),
  cap_bac TEXT,
  hoc_vi TEXT,
  chuc_vu TEXT,
  ma_khoa_ban TEXT NOT NULL REFERENCES khoa_ban(ma_khoa_ban),
  ma_tep_anh_the TEXT,
  ma_tep_anh_can_cuoc TEXT,
  so_buoi_day INTEGER NOT NULL DEFAULT 0,
  da_xoa INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tiet_hoc (
  ma_tiet_hoc TEXT PRIMARY KEY,
  ten_tiet_hoc TEXT NOT NULL,
  thoi_gian_bat_dau TEXT NOT NULL,
  thoi_gian_ket_thuc TEXT NOT NULL,
  CHECK (thoi_gian_bat_dau < thoi_gian_ket_thuc)
);

CREATE TABLE lich_hoc (
  ma_lich_hoc TEXT PRIMARY KEY,
  ma_lop_hoc TEXT NOT NULL REFERENCES lop_hoc(ma_lop_hoc),
  ma_mon_hoc TEXT NOT NULL REFERENCES mon_hoc(ma_mon_hoc),
  ma_giao_vien TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  ma_phong_hoc TEXT NOT NULL REFERENCES phong_hoc(ma_phong_hoc),
  ma_tiet_hoc TEXT NOT NULL REFERENCES tiet_hoc(ma_tiet_hoc),
  ngay_hoc TEXT NOT NULL
);

CREATE INDEX chi_muc_lich_theo_phong ON lich_hoc(ngay_hoc, ma_tiet_hoc, ma_phong_hoc);
CREATE INDEX chi_muc_lich_theo_giao_vien ON lich_hoc(ngay_hoc, ma_tiet_hoc, ma_giao_vien);

CREATE TABLE cau_hinh_cong_thuc_diem (
  ma_cong_thuc TEXT PRIMARY KEY,
  ma_mon_hoc TEXT NOT NULL,
  ten_cong_thuc TEXT NOT NULL
);

CREATE TABLE cau_hinh_cong_thuc_diem_thanh_phan (
  ma_cong_thuc TEXT NOT NULL REFERENCES cau_hinh_cong_thuc_diem(ma_cong_thuc),
  truong_diem TEXT NOT NULL,
  trong_so REAL NOT NULL,
  PRIMARY KEY (ma_cong_thuc, truong_diem)
);

CREATE TABLE mau_bang_diem (
  ma_mau_bang_diem TEXT PRIMARY KEY,
  ten_mau_bang_diem TEXT NOT NULL,
  pham_vi_ap_dung TEXT NOT NULL,
  cong_thuc TEXT NOT NULL,
  thoi_diem_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE diem_thanh_phan (
  ma_diem TEXT PRIMARY KEY,
  ma_hoc_vien TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  ma_lop_hoc TEXT NOT NULL REFERENCES lop_hoc(ma_lop_hoc),
  ma_mon_hoc TEXT NOT NULL REFERENCES mon_hoc(ma_mon_hoc),
  diem_thuc_hanh_1 REAL NOT NULL,
  diem_thuc_hanh_2 REAL NOT NULL,
  diem_thuc_hanh_3 REAL NOT NULL,
  diem_thuc_hanh_4 REAL NOT NULL,
  diem_bai_tap_1 REAL NOT NULL,
  diem_bai_tap_2 REAL NOT NULL,
  diem_thi_cuoi_ky REAL NOT NULL,
  thoi_diem_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (diem_thuc_hanh_1 BETWEEN 0 AND 10),
  CHECK (diem_thuc_hanh_2 BETWEEN 0 AND 10),
  CHECK (diem_thuc_hanh_3 BETWEEN 0 AND 10),
  CHECK (diem_thuc_hanh_4 BETWEEN 0 AND 10),
  CHECK (diem_bai_tap_1 BETWEEN 0 AND 10),
  CHECK (diem_bai_tap_2 BETWEEN 0 AND 10),
  CHECK (diem_thi_cuoi_ky BETWEEN 0 AND 10)
);

CREATE TABLE lich_su_diem (
  ma_lich_su_diem TEXT PRIMARY KEY,
  ma_diem TEXT NOT NULL REFERENCES diem_thanh_phan(ma_diem),
  truong_diem TEXT NOT NULL,
  gia_tri_cu REAL NOT NULL,
  gia_tri_moi REAL NOT NULL,
  ma_nguoi_sua TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  thoi_diem_sua TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bo_nho_dem_phieu_diem (
  ma_lop_hoc TEXT PRIMARY KEY REFERENCES lop_hoc(ma_lop_hoc),
  noi_dung TEXT NOT NULL,
  thoi_diem_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cau_hinh_nhap_bang_tinh (
  ma_cau_hinh_nhap TEXT PRIMARY KEY,
  ten_cau_hinh TEXT NOT NULL,
  mau_ten_trang TEXT NOT NULL,
  che_do_khop TEXT NOT NULL
);

CREATE TABLE cau_hinh_nhap_bang_tinh_cot (
  ma_cau_hinh_nhap TEXT NOT NULL REFERENCES cau_hinh_nhap_bang_tinh(ma_cau_hinh_nhap),
  truong_he_thong TEXT NOT NULL,
  ten_tieu_de TEXT NOT NULL,
  cot_bang_tinh TEXT NOT NULL,
  bat_buoc INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ma_cau_hinh_nhap, truong_he_thong)
);

CREATE TABLE tep_tin (
  ma_tep_tin TEXT PRIMARY KEY,
  ten_tep TEXT NOT NULL,
  loai_tep TEXT NOT NULL,
  dung_luong_byte INTEGER NOT NULL,
  ma_nguoi_tai TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  duong_dan_noi_bo TEXT,
  thoi_diem_tai TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quyen_xem_tai_lieu (
  ma_tep_tin TEXT NOT NULL REFERENCES tep_tin(ma_tep_tin),
  ma_vai_tro TEXT NOT NULL REFERENCES vai_tro(ma_vai_tro),
  PRIMARY KEY (ma_tep_tin, ma_vai_tro)
);

CREATE TABLE tai_lieu_giang_day (
  ma_tai_lieu_giang_day TEXT PRIMARY KEY,
  ma_giao_vien TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  ma_mon_hoc TEXT NOT NULL REFERENCES mon_hoc(ma_mon_hoc),
  ma_tep_tin TEXT NOT NULL REFERENCES tep_tin(ma_tep_tin),
  ten_tai_lieu TEXT NOT NULL,
  da_xoa INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE tep_phu_luc_hoi_dong (
  ma_tep_phu_luc TEXT PRIMARY KEY,
  loai_phu_luc TEXT NOT NULL,
  ma_lop_hoc TEXT NOT NULL REFERENCES lop_hoc(ma_lop_hoc),
  ten_tep TEXT NOT NULL,
  dung_luong_byte INTEGER NOT NULL,
  dang_bat INTEGER NOT NULL DEFAULT 1,
  da_xoa INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE ket_qua_quet_the (
  ma_ket_qua_quet TEXT PRIMARY KEY,
  ho_va_ten TEXT,
  so_can_cuoc TEXT,
  ngay_sinh TEXT,
  que_quan TEXT,
  thoi_diem_quet TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cuoc_hoi_thoai (
  ma_cuoc_hoi_thoai TEXT PRIMARY KEY,
  tieu_de TEXT NOT NULL,
  ma_hoc_vien TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  ma_phong_dao_tao TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung)
);

CREATE TABLE tin_nhan (
  ma_tin_nhan TEXT PRIMARY KEY,
  ma_cuoc_hoi_thoai TEXT NOT NULL REFERENCES cuoc_hoi_thoai(ma_cuoc_hoi_thoai),
  ma_nguoi_gui TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  noi_dung TEXT NOT NULL,
  thoi_diem_gui TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phien_dang_nhap (
  ma_phien TEXT PRIMARY KEY,
  ma_nguoi_dung TEXT NOT NULL REFERENCES nguoi_dung(ma_nguoi_dung),
  thoi_diem_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  da_huy INTEGER NOT NULL DEFAULT 0
);
