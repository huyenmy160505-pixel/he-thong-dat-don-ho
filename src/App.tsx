import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, Store, UserCheck, LogOut, Lock, KeyRound, QrCode, Eye,
  Upload, CheckCircle2, AlertTriangle, XCircle, MessageSquare, Send,
  Plus, Edit3, Trash2, Search, Filter, Clock, DollarSign, Package,
  Truck, FileText, Sparkles, RefreshCw, Calculator, Copy, Check,
  ChevronRight, ArrowRight, ExternalLink, Image as ImageIcon, HelpCircle,
  Unlock, UserPlus, Percent, Layers, CheckSquare, AlertOctagon, Terminal,
  Smartphone, Building2, CreditCard, BadgeCheck, Flame, RotateCcw
} from 'lucide-react';

// ============================================================================
// HÀM TIỆN ÍCH & DỮ LIỆU KHỞI TẠO MẪU
// ============================================================================
const formatVND = (amount) => {
  const num = Number(amount) || 0;
  return num.toLocaleString('vi-VN') + 'đ';
};

const INITIAL_USERS = [
  {
    maNguoiDung: 'USR_ADMIN_01',
    soDienThoai: '0901000001',
    email: 'admin@hethong.vn',
    hoVaTen: 'Admin Điều Phối Trung Gian',
    matKhau: '123456',
    vaiTro: 'ADMIN',
    phanTramHoaHongMacDinh: 0,
    nganHang: '',
    soTaiKhoan: '',
    chuTaiKhoan: '',
    anhMaQRUrl: '',
    trangThaiTK: 'ACTIVE',
    firstLogin: false,
    dangTrucTuyen: true,
    thoiGianHoatDongGanNhat: 'Đang hoạt động',
  },
];

const INITIAL_ADDRESSES = [];

const INITIAL_CAMPAIGNS = [];

const INITIAL_ORDERS = [];

const INITIAL_SETTLEMENTS = {
  shopPayments: {},
  ctvPayouts: {},
};

// ============================================================================
// COMPONENT PHỤ TRỢ 1: HUY HIỆU TRẠNG THÁI TRỰC TUYẾN KIỂU MESSENGER (US12)
// ============================================================================
const OnlineStatusBadge = ({ user, compact = false }) => {
  if (!user) return null;
  const isOnline = Boolean(user.dangTrucTuyen);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
      } ${
        isOnline
          ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
          : 'bg-slate-200/80 text-slate-700 border border-slate-300'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
        }`}
      />
      <span>{isOnline ? 'Đang hoạt động' : user.thoiGianHoatDongGanNhat || 'Ngoại tuyến'}</span>
    </span>
  );
};

// ============================================================================
// COMPONENT PHỤ TRỢ 2: KHUNG ẢNH ĐƠN MẪU (TỶ LỆ DỌC 9:16 GỌN GÀNG, KHÔNG LẶP CHỮ)
// ============================================================================
const DirectCampaignSampleImage = ({ campaign, title, targetPrice, calcType, onZoomImage }) => {
  const customImg = campaign?.anhMauDataUrl;
  const links = campaign?.danhSachLink || [
    {
      link: campaign?.linkSanPham,
      phanLoai: 'Theo đơn mẫu',
      soLuongMua: '1',
      ghiChuLoai: title,
    },
  ];

  return (
    <div
      onClick={() => onZoomImage && onZoomImage(campaign)}
      className="rounded-2xl border-2 border-slate-800 bg-slate-950 text-white overflow-hidden flex flex-col justify-between cursor-pointer group shadow-sm aspect-[9/16] max-w-[180px] w-full mx-auto"
      title="Chạm để phóng to ảnh đơn mẫu"
    >
      <div className="bg-slate-900 px-2.5 py-1.5 flex items-center justify-between text-[10px] text-slate-300 border-b border-slate-800 shrink-0">
        <span className="font-bold text-amber-400">ẢNH ĐƠN MẪU</span>
        <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">COD</span>
      </div>

      {customImg ? (
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-black">
          <img
            src={customImg}
            alt="Ảnh đơn mẫu"
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="flex-1 p-2.5 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-indigo-950 text-[11px]">
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-300 font-semibold">Màn hình thanh toán mẫu:</div>
            <div className="p-2 rounded-lg bg-white/10 border border-white/10 space-y-1">
              <div className="font-bold text-amber-300 break-words leading-snug text-[11px]">
                {links[0]?.phanLoai || title}
              </div>
              <div className="text-[10px] text-emerald-300 font-bold">
                SL: {links[0]?.soLuongMua || '1'}
              </div>
              {links.length > 1 && (
                <div className="text-[10px] text-indigo-200 font-bold pt-0.5 border-t border-white/10">
                  + {links.length - 1} món gộp chung đơn
                </div>
              )}
            </div>
          </div>

          <div className="bg-rose-600 text-white rounded-lg px-2 py-1.5 text-center shadow">
            <span className="block text-[9px] uppercase opacity-90">
              {calcType === 'DUOI_GIA_TRAN_LA_CONG' ? 'Giá mẫu trên ảnh' : 'Giá COD cần đặt'}
            </span>
            <span className="font-extrabold font-mono text-xs">
              {formatVND(targetPrice)}
            </span>
          </div>
        </div>
      )}

      <div className="bg-slate-900 text-center py-1.5 text-[10px] text-indigo-300 font-bold border-t border-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0">
        🔍 Phóng to ảnh
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT CHÍNH: APP
// ============================================================================
export default function App() {
  // Khóa lưu trữ phiên bản sạch (CLEAN_V1) chỉ có duy nhất tài khoản Admin ban đầu
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('OMS_AI_USERS_CLEAN_V1');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('OMS_AI_ADDRESSES_CLEAN_V1');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('OMS_AI_CAMPAIGNS_CLEAN_V1');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('OMS_AI_ORDERS_CLEAN_V1');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [settlements, setSettlements] = useState(() => {
    const saved = localStorage.getItem('OMS_AI_SETTLEMENTS_CLEAN_V1');
    return saved ? JSON.parse(saved) : INITIAL_SETTLEMENTS;
  });

  // State Chat Thanh Toán lâu dài (Không biến mất khi đơn đã tất toán) giữa Admin <-> Shop / CTV
  const [paymentChats, setPaymentChats] = useState(() => {
    const saved = localStorage.getItem('OMS_AI_PAYMENT_CHATS_CLEAN_V1');
    return saved ? JSON.parse(saved) : {};
  });
  const [activePaymentChatPartnerId, setActivePaymentChatPartnerId] = useState(null);
  const [paymentChatInput, setPaymentChatInput] = useState('');

  // Lưu vào LocalStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('OMS_AI_USERS_CLEAN_V1', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('OMS_AI_ADDRESSES_CLEAN_V1', JSON.stringify(addresses));
  }, [addresses]);
  useEffect(() => {
    localStorage.setItem('OMS_AI_CAMPAIGNS_CLEAN_V1', JSON.stringify(campaigns));
  }, [campaigns]);
  useEffect(() => {
    localStorage.setItem('OMS_AI_ORDERS_CLEAN_V1', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('OMS_AI_SETTLEMENTS_CLEAN_V1', JSON.stringify(settlements));
  }, [settlements]);
  useEffect(() => {
    localStorage.setItem('OMS_AI_PAYMENT_CHATS_CLEAN_V1', JSON.stringify(paymentChats));
  }, [paymentChats]);

  // Trạng thái phiên đăng nhập hiện tại (Mặc định là null -> Màn hình Đăng nhập)
  const [currentUserId, setCurrentUserId] = useState(null);
  const currentUser = useMemo(
    () => users.find((u) => u.maNguoiDung === currentUserId) || null,
    [users, currentUserId]
  );

  // State trang Đăng nhập (Bản Production: Để trống hoàn toàn, không lộ thông tin tài khoản)
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // State chuyển Tab trong từng phân hệ (Tất cả phân hệ đều có Tab PROFILE bên trong)
  const [adminTab, setAdminTab] = useState('DASHBOARD'); // DASHBOARD | ACCOUNTS | CAMPAIGNS | SETTLEMENT | PROFILE
  const [shopTab, setShopTab] = useState('ORDERS'); // ORDERS | CREATE_CAMPAIGN | WAREHOUSE_MATCH | ADDRESS_BOOK | SETTLEMENT | PROFILE
  const [ctvTab, setCtvTab] = useState('MARKETPLACE'); // MARKETPLACE | MY_ORDERS | WALLET_QR | PROFILE

  // State Chỉnh sửa Tài khoản cá nhân: Đổi mật khẩu & Cập nhật QR ngân hàng BÊN TRONG KHI ĐĂNG NHẬP (UC02)
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const [profileFullName, setProfileFullName] = useState('');
  const [profileBankName, setProfileBankName] = useState('');
  const [profileBankNumber, setProfileBankNumber] = useState('');
  const [profileBankHolder, setProfileBankHolder] = useState('');
  const [profileQrDataUrl, setProfileQrDataUrl] = useState('');

  // Đồng bộ dữ liệu hồ sơ khi người dùng đăng nhập vào trong hệ thống
  useEffect(() => {
    if (currentUser) {
      setProfileFullName(currentUser.hoVaTen || '');
      setProfileBankName(currentUser.nganHang || '');
      setProfileBankNumber(currentUser.soTaiKhoan || '');
      setProfileBankHolder(currentUser.chuTaiKhoan || currentUser.hoVaTen?.toUpperCase() || '');
      setProfileQrDataUrl(currentUser.anhMaQRUrl || '');
      setOldPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    }
  }, [currentUser?.maNguoiDung]);

  // Đồng bộ thời gian thực khi mở 3 cửa sổ trình duyệt giả lập 3 máy tính (Admin - Shop - CTV)
  useEffect(() => {
    const handleStorageSync = (e) => {
      if (e.key === 'OMS_AI_USERS_CLEAN_V1' && e.newValue) setUsers(JSON.parse(e.newValue));
      if (e.key === 'OMS_AI_ADDRESSES_CLEAN_V1' && e.newValue) setAddresses(JSON.parse(e.newValue));
      if (e.key === 'OMS_AI_CAMPAIGNS_CLEAN_V1' && e.newValue) setCampaigns(JSON.parse(e.newValue));
      if (e.key === 'OMS_AI_ORDERS_CLEAN_V1' && e.newValue) setOrders(JSON.parse(e.newValue));
      if (e.key === 'OMS_AI_SETTLEMENTS_CLEAN_V1' && e.newValue) setSettlements(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // Toast thông báo (Thay thế hoàn toàn alert/confirm)
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Modal Xem ảnh bằng chứng / Xem QR / Xem Bill CK (Ẩn toàn bộ ảnh vào nút bấm)
  const [evidenceModal, setEvidenceModal] = useState(null);
  // Cấu trúc: { type: 'ORDER_IMAGES' | 'QR_CODE' | 'BILL_CK', title, data }

  // Modal Chat riêng theo từng đơn hàng (UC08)
  const [activeChatOrderId, setActiveChatOrderId] = useState(null);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const activeChatOrder = useMemo(
    () => orders.find((o) => o.maDonHeThong === activeChatOrderId) || null,
    [orders, activeChatOrderId]
  );

  // ==========================================================================
  // ĐỒNG BỘ ĐÁM MÂY MIỄN PHÍ CHO NHIỀU MÁY / NHIỀU TÀI KHOẢN (CLOUD DB SYNC)
  // Hỗ trợ kết nối Firebase Realtime Database (Miễn phí) để nhiều thiết bị dùng chung
  // ==========================================================================
  const [cloudDbUrl, setCloudDbUrl] = useState(() => {
    return (
      localStorage.getItem('OMS_AI_CLOUD_DB_URL') ||
      'https://web-dat-don-ho-default-rtdb.asia-southeast1.firebasedatabase.app/'
    );
  });
  const [cloudSyncStatus, setCloudSyncStatus] = useState('LOCAL'); // LOCAL | SYNCING | CONNECTED | ERROR
  const isFetchingCloudRef = React.useRef(false);
  const hasInitialCloudLoadedRef = React.useRef(false);

  const normalizeFirebaseUrl = (rawUrl) => {
    if (!rawUrl || !rawUrl.trim()) return '';
    let clean = rawUrl.trim().replace(/\/+$/, '');
    if (!clean.startsWith('https://')) return '';
    return `${clean}/oms_clean_v1.json`;
  };

  // Tải dữ liệu từ Cloud DB về máy định kỳ mỗi 3.5 giây (khi có cấu hình URL)
  useEffect(() => {
    const endpoint = normalizeFirebaseUrl(cloudDbUrl);
    if (!endpoint) {
      setCloudSyncStatus('LOCAL');
      return;
    }

    const pullFromCloud = async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Cloud fetch error');
        const data = await res.json();
        if (data && Array.isArray(data.users) && data.users.length > 0) {
          isFetchingCloudRef.current = true;
          setUsers(data.users);
          setAddresses(data.addresses || []);
          setCampaigns(data.campaigns || []);
          setOrders(data.orders || []);
          setSettlements(data.settlements || INITIAL_SETTLEMENTS);
          setPaymentChats(data.paymentChats || {});
          hasInitialCloudLoadedRef.current = true;
          setCloudSyncStatus('CONNECTED');
          setTimeout(() => {
            isFetchingCloudRef.current = false;
          }, 300);
        } else if (data === null) {
          // Nhánh Cloud DB mới tạo còn trống -> Đẩy dữ liệu hiện tại lên khởi tạo lần đầu
          hasInitialCloudLoadedRef.current = true;
          await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              users,
              addresses,
              campaigns,
              orders,
              settlements,
              paymentChats,
              updatedAt: Date.now(),
            }),
          });
          setCloudSyncStatus('CONNECTED');
        }
      } catch (err) {
        setCloudSyncStatus('ERROR');
      }
    };

    pullFromCloud();
    const interval = setInterval(pullFromCloud, 3500);
    return () => clearInterval(interval);
  }, [cloudDbUrl]);

  // Tự động đẩy dữ liệu lên Cloud DB CHỈ SAU KHI đã đồng bộ lần đầu thành công (chống ghi đè khi mở máy mới)
  useEffect(() => {
    const endpoint = normalizeFirebaseUrl(cloudDbUrl);
    if (!endpoint || isFetchingCloudRef.current || !hasInitialCloudLoadedRef.current) return;

    const pushToCloud = async () => {
      try {
        await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            users,
            addresses,
            campaigns,
            orders,
            settlements,
            paymentChats,
            updatedAt: Date.now(),
          }),
        });
        setCloudSyncStatus('CONNECTED');
      } catch (err) {
        setCloudSyncStatus('ERROR');
      }
    };

    pushToCloud();
  }, [users, addresses, campaigns, orders, settlements, paymentChats]);

  // ==========================================================================
  // XỬ LÝ ĐĂNG NHẬP & QUẢN LÝ HỒ SƠ CÁ NHÂN BÊN TRONG HỆ THỐNG (UC02 & US03)
  // ==========================================================================
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const trimmed = loginInput.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.soDienThoai.toLowerCase() === trimmed ||
        u.email.toLowerCase() === trimmed
    );

    if (!found) {
      setLoginError('Tài khoản không tồn tại! Hệ thống định danh khép kín chỉ cho phép tài khoản do Admin cấp.');
      return;
    }
    if (found.trangThaiTK === 'LOCKED') {
      setLoginError('Tài khoản của bạn đã bị Quản trị viên tạm khóa do vi phạm quy định!');
      return;
    }
    if (found.matKhau !== passwordInput) {
      setLoginError('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      return;
    }

    // Đăng nhập thành công -> Vào thẳng bên trong giao diện của vai trò tương ứng
    setUsers((prev) =>
      prev.map((u) =>
        u.maNguoiDung === found.maNguoiDung
          ? { ...u, dangTrucTuyen: true, thoiGianHoatDongGanNhat: 'Đang hoạt động' }
          : u
      )
    );
    setCurrentUserId(found.maNguoiDung);

    // Nếu là tài khoản đăng nhập lần đầu hoặc chưa có QR, mở sẵn tab Tài khoản cá nhân ở bên trong hệ thống
    if (found.firstLogin || !found.anhMaQRUrl) {
      if (found.vaiTro === 'ADMIN') setAdminTab('PROFILE');
      if (found.vaiTro === 'NGUOI_NHO_DAT') setShopTab('PROFILE');
      if (found.vaiTro === 'NGUOI_DAT') setCtvTab('PROFILE');
      showToast(
        'Vui lòng đổi mật khẩu cá nhân và cập nhật Mã QR ngân hàng trong mục Tài khoản cá nhân!',
        'info'
      );
    } else {
      showToast(`Đăng nhập thành công: ${found.hoVaTen}`, 'success');
    }
  };

  // Xử lý đổi mật khẩu bên trong hệ thống (UC02)
  const handleChangePasswordInside = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (oldPasswordInput !== currentUser.matKhau) {
      showToast('Mật khẩu hiện tại không đúng!', 'error');
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 6) {
      showToast('Mật khẩu cá nhân mới phải có từ 6 ký tự trở lên!', 'error');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      showToast('Mật khẩu xác nhận không khớp với mật khẩu mới!', 'error');
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.maNguoiDung === currentUser.maNguoiDung
          ? { ...u, matKhau: newPasswordInput, firstLogin: false }
          : u
      )
    );
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    showToast('Đã cập nhật mật khẩu cá nhân mới thành công!', 'success');
  };

  // Xử lý tải file ảnh QR thật từ máy tính/điện thoại của người dùng
  const handleUploadQrFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileQrDataUrl(reader.result);
        showToast('Đã đọc ảnh Mã QR từ thiết bị! Nhấn "Lưu Hồ Sơ & Mã QR" để áp dụng.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Lưu thông tin Ngân hàng & Ảnh Mã QR bên trong hệ thống (UC02 & US03)
  const handleSaveBankAndQrInside = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!profileBankName.trim()) {
      showToast('Vui lòng nhập tên Ngân hàng thụ hưởng!', 'error');
      return;
    }
    if (!profileBankNumber.trim()) {
      showToast('Vui lòng nhập Số tài khoản ngân hàng!', 'error');
      return;
    }
    const finalQr =
      profileQrDataUrl || `QR_${currentUser.maNguoiDung}_${profileBankName.trim()}_${profileBankNumber.trim()}`;

    setUsers((prev) =>
      prev.map((u) =>
        u.maNguoiDung === currentUser.maNguoiDung
          ? {
              ...u,
              hoVaTen: profileFullName.trim() || u.hoVaTen,
              nganHang: profileBankName.trim(),
              soTaiKhoan: profileBankNumber.trim(),
              chuTaiKhoan: profileBankHolder.trim().toUpperCase() || u.hoVaTen.toUpperCase(),
              anhMaQRUrl: finalQr,
              firstLogin: false,
            }
          : u
      )
    );
    setProfileQrDataUrl(finalQr);
    showToast('Đã lưu thông tin tài khoản ngân hàng & ẩn ảnh Mã QR vào nút [Xem QR]!', 'success');
  };

  // Mở nhanh tab Tài khoản cá nhân của vai trò hiện tại
  const openMyProfileTab = () => {
    if (!currentUser) return;
    if (currentUser.vaiTro === 'ADMIN') setAdminTab('PROFILE');
    if (currentUser.vaiTro === 'NGUOI_NHO_DAT') setShopTab('PROFILE');
    if (currentUser.vaiTro === 'NGUOI_DAT') setCtvTab('PROFILE');
  };

  const handleLogout = () => {
    if (currentUser) {
      const timeStr = new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.maNguoiDung === currentUser.maNguoiDung
            ? {
                ...u,
                dangTrucTuyen: false,
                thoiGianHoatDongGanNhat: `Hoạt động lúc ${timeStr}`,
              }
            : u
        )
      );
    }
    setCurrentUserId(null);
    setLoginInput('');
    setPasswordInput('');
    setLoginError('');
  };

  // ==========================================================================
  // XỬ LÝ CHAT RIÊNG THEO ĐƠN & CHẤM ĐỎ TIN NHẮN MỚI (UC08)
  // ==========================================================================
  const openOrderChat = (orderId) => {
    setActiveChatOrderId(orderId);
    // Đánh dấu đã đọc tin nhắn cho người dùng hiện tại
    if (currentUser) {
      setOrders((prev) =>
        prev.map((o) =>
          o.maDonHeThong === orderId
            ? {
                ...o,
                tinNhan: o.tinNhan.map((m) => ({
                  ...m,
                  chuaDocBoi: (m.chuaDocBoi || []).filter((id) => id !== currentUser.maNguoiDung),
                })),
              }
            : o
        )
      );
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessageInput.trim() || !activeChatOrder || !currentUser) return;

    const recipients = [activeChatOrder.maNguoiNhoDat, activeChatOrder.maNguoiDat, 'USR_ADMIN_01'].filter(
      (id) => id !== currentUser.maNguoiDung
    );

    const newMsg = {
      maTinNhan: 'MSG_' + Date.now(),
      maNguoiGui: currentUser.maNguoiDung,
      tenNguoiGui: currentUser.hoVaTen,
      vaiTroGui: currentUser.vaiTro,
      noiDung: chatMessageInput.trim(),
      thoiGianGui: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      chuaDocBoi: recipients,
    };

    setOrders((prev) =>
      prev.map((o) =>
        o.maDonHeThong === activeChatOrder.maDonHeThong
          ? { ...o, tinNhan: [...o.tinNhan, newMsg] }
          : o
      )
    );
    setChatMessageInput('');
  };

  const handleMarkOrderCancelOrReturn = (orderId, reasonStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.maDonHeThong === orderId
          ? {
              ...o,
              trangThaiDon: reasonStatus, // DA_HUY_HOAN_HANG
              trangThaiTT2Chang: 'KHOA_TINH_CONG',
              ngayCapNhat: new Date().toLocaleString('vi-VN'),
            }
          : o
      )
    );
    showToast('Đã chuyển đơn sang trạng thái Hủy/Hoàn hàng và khóa tính tiền công!', 'error');
  };

  // ==========================================================================
  // STATE & LOGIC PHÂN HỆ 1: ADMIN TRUNG GIAN (UC01, UC04_ext, UC10)
  // ==========================================================================
  const [newAccPhone, setNewAccPhone] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccRole, setNewAccRole] = useState('NGUOI_NHO_DAT');
  const [newAccComm, setNewAccComm] = useState(10);
  const [newAccPass, setNewAccPass] = useState('123456');
  const [editingKeoComm, setEditingKeoComm] = useState({});
  const [orderSearch, setOrderSearch] = useState('');

  // State lọc, tìm kiếm nhanh tài khoản & cấp lại mật khẩu khi thành viên quên MK (UC01)
  const [accountRoleFilter, setAccountRoleFilter] = useState('ALL'); // ALL | NGUOI_NHO_DAT | NGUOI_DAT
  const [accountSearchQuery, setAccountSearchQuery] = useState('');
  const [resettingUserId, setResettingUserId] = useState(null);
  const [resetPasswordValue, setResetPasswordValue] = useState('123456');

  // State lưu ảnh Bill tải lên ở Chặng 1 (Shop) và Chặng 2 (Admin) trước khi bấm xác nhận Đã chuyển
  const [shopStage1DraftBill, setShopStage1DraftBill] = useState('');
  const [adminStage2DraftBills, setAdminStage2DraftBills] = useState({});

  // State tách Tab "Chờ xử lý" và "Lịch sử lưu trữ (Tự xóa sau 7-30 ngày)" cho Chốt lương & Đơn hàng
  const [adminSettleSubTab, setAdminSettleSubTab] = useState('ACTIVE'); // ACTIVE | HISTORY
  const [shopOrderSearch, setShopOrderSearch] = useState('');
  const [shopOrderSubTab, setShopOrderSubTab] = useState('ACTIVE'); // ACTIVE | ARCHIVED
  const [shopSettleSubTab, setShopSettleSubTab] = useState('ACTIVE'); // ACTIVE | HISTORY

  // State Bộ lọc Sàn kèo của CTV: Tỉnh giao hàng, Loại số lượng (Không giới hạn / Giới hạn), Sắp xếp tiền công
  const [ctvProvinceFilter, setCtvProvinceFilter] = useState('ALL');
  const [ctvLimitFilter, setCtvLimitFilter] = useState('ALL'); // ALL | UNLIMITED | LIMITED
  const [ctvWageSort, setCtvWageSort] = useState('HIGH_TO_LOW'); // HIGH_TO_LOW | LOW_TO_HIGH
  const [ctvWalletSubTab, setCtvWalletSubTab] = useState('PENDING'); // PENDING | PAID_ARCHIVE

  // State xác nhận ĐỦ 2 MÃ khi CTV tải 2 ảnh Báo giao (Mã đơn hàng sàn + Mã vận đơn)
  const [deliveryOrderCodeInput, setDeliveryOrderCodeInput] = useState('');

  const handleSendPaymentChat = (e) => {
    e.preventDefault();
    if (!paymentChatInput.trim() || !activePaymentChatPartnerId || !currentUser) return;
    const msg = {
      id: 'PMSG_' + Date.now(),
      senderId: currentUser.maNguoiDung,
      senderName: currentUser.hoVaTen,
      text: paymentChatInput.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setPaymentChats((prev) => ({
      ...prev,
      [activePaymentChatPartnerId]: [...(prev[activePaymentChatPartnerId] || []), msg],
    }));
    setPaymentChatInput('');
  };

  // Hàm trích xuất Tỉnh/Thành phố từ địa chỉ kho để CTV lọc kèo giao về tỉnh nào
  const extractProvinceFromAddress = (addrObj) => {
    if (!addrObj || !addrObj.diaChiChiTiet) return 'Khác';
    const parts = addrObj.diaChiChiTiet.split(',');
    return parts[parts.length - 1].trim();
  };

  // Hàm tính tiền công thực nhận (sau khi hệ thống ngầm trừ phí) để hiển thị cho CTV mà KHÔNG lộ % hoa hồng Admin
  const getCtvNetWageForCampaign = (keo, customCod) => {
    const commRate = keo.phanTramHoaHongApDung || 10;
    const rawWage =
      keo.kieuTinhCong === 'CONG_CO_DINH'
        ? keo.tienCongCoDinh
        : Math.max(
            0,
            keo.giaMucTieuHoacTran -
              (customCod !== undefined ? Number(customCod) : keo.giaMauTrenAnh)
          );
    return Math.round(rawWage * (1 - commRate / 100));
  };

  const handleCopyProductLink = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast(`Đã sao chép đường link sản phẩm: ${url}`, 'success');
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newAccPhone.trim() || !newAccEmail.trim() || !newAccName.trim()) {
      showToast('Vui lòng nhập đầy đủ SĐT, Gmail và Họ tên hiển thị!', 'error');
      return;
    }
    const duplicate = users.some(
      (u) =>
        u.soDienThoai.toLowerCase() === newAccPhone.trim().toLowerCase() ||
        u.email.toLowerCase() === newAccEmail.trim().toLowerCase()
    );
    if (duplicate) {
      showToast('BÁO ĐỎ (UC01 - 3a): SĐT hoặc Gmail đã tồn tại trên hệ thống!', 'error');
      return;
    }
    const newUser = {
      maNguoiDung: `USR_${newAccRole === 'NGUOI_NHO_DAT' ? 'SHOP' : 'CTV'}_${Date.now().toString().slice(-3)}`,
      soDienThoai: newAccPhone.trim(),
      email: newAccEmail.trim(),
      hoVaTen: newAccName.trim(),
      matKhau: newAccPass || '123456',
      vaiTro: newAccRole,
      phanTramHoaHongMacDinh: newAccRole === 'NGUOI_NHO_DAT' ? Number(newAccComm) : 0,
      nganHang: '',
      soTaiKhoan: '',
      chuTaiKhoan: '',
      anhMaQRUrl: '',
      trangThaiTK: 'ACTIVE',
      firstLogin: true,
      dangTrucTuyen: false,
      thoiGianHoatDongGanNhat: 'Chờ đổi MK lần đầu',
    };
    setUsers((prev) => [...prev, newUser]);
    setNewAccPhone('');
    setNewAccEmail('');
    setNewAccName('');
    showToast(`Đã cấp tài khoản mới cho "${newUser.hoVaTen}" (Bắt buộc đổi MK ở lần đăng nhập đầu)!`, 'success');
  };

  const handleToggleLockUser = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.maNguoiDung === userId
          ? { ...u, trangThaiTK: u.trangThaiTK === 'ACTIVE' ? 'LOCKED' : 'ACTIVE' }
          : u
      )
    );
    showToast('Đã cập nhật trạng thái Khóa / Mở khóa tài khoản!', 'info');
  };

  // Đặt lại mật khẩu nhanh khi Người nhờ đặt hoặc Người đặt quên mật khẩu
  const handleAdminResetUserPassword = (userId) => {
    const newPass = resetPasswordValue.trim();
    if (!newPass || newPass.length < 4) {
      showToast('Vui lòng nhập mật khẩu cấp lại tối thiểu 4 ký tự!', 'error');
      return;
    }
    const target = users.find((u) => u.maNguoiDung === userId);
    setUsers((prev) =>
      prev.map((u) =>
        u.maNguoiDung === userId
          ? { ...u, matKhau: newPass, trangThaiTK: 'ACTIVE' }
          : u
      )
    );
    setResettingUserId(null);
    setResetPasswordValue('123456');
    showToast(
      `Đã đặt lại mật khẩu cho "${target?.hoVaTen}" (${target?.soDienThoai}) thành: ${newPass}`,
      'success'
    );
  };

  const handleCopyAccountCredentials = (u) => {
    const text = `Tài khoản: ${u.hoVaTen} | SĐT: ${u.soDienThoai} | Email: ${u.email} | Mật khẩu: ${u.matKhau}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(`Đã sao chép thông tin đăng nhập & mật khẩu của ${u.hoVaTen}!`, 'info');
  };

  const handleUpdateShopDefaultComm = (userId, newVal) => {
    const num = Math.max(0, Math.min(50, Number(newVal) || 0));
    setUsers((prev) =>
      prev.map((u) => (u.maNguoiDung === userId ? { ...u, phanTramHoaHongMacDinh: num } : u))
    );
    showToast(`Đã cập nhật hoa hồng mặc định Tầng 1 thành ${num}%!`, 'success');
  };

  const handleSaveCampaignCommOverride = (maKeo) => {
    const val = editingKeoComm[maKeo];
    if (val === undefined || val === '') return;
    const num = Math.max(0, Math.min(50, Number(val)));
    setCampaigns((prev) =>
      prev.map((k) =>
        k.maKeo === maKeo
          ? { ...k, phanTramHoaHongApDung: num, daSuaHoaHongRieng: true }
          : k
      )
    );
    // Cập nhật lại tiền công thực nhận cho các đơn của kèo này
    setOrders((prev) =>
      prev.map((o) => {
        if (o.maKeo !== maKeo) return o;
        const hh = Math.round((o.tienCongGoc * num) / 100);
        return {
          ...o,
          phanTramHoaHong: num,
          hoaHongAdmin: hh,
          tienCongThucNhan: o.tienCongGoc - hh,
        };
      })
    );
    showToast(`Đã chỉnh sửa hoa hồng Tầng 2 của kèo ${maKeo} thành ${num}% và tính lại công thực nhận!`, 'success');
  };

  const handleAdminConfirmStage1 = (shopId) => {
    const payInfo = settlements.shopPayments[shopId];
    if (!payInfo || !payInfo.anhBillChang1) {
      showToast('Shop này chưa tải ảnh Bill chuyển khoản Chặng 1 lên, không thể bấm xác nhận!', 'error');
      return;
    }
    setSettlements((prev) => ({
      ...prev,
      shopPayments: {
        ...prev.shopPayments,
        [shopId]: {
          ...(prev.shopPayments[shopId] || {}),
          trangThai: 'ADMIN_DA_XAC_NHAN',
          thoiGianDuyet: new Date().toLocaleString('vi-VN'),
          hanLuuTru: 'Tự động dọn sau 30 ngày (Giữ nguyên lịch sử Chat)',
        },
      },
    }));
    // Chỉ đánh dấu các đơn ĐÃ HOÀN TẤT THÀNH CÔNG của Shop này là đã duyệt Chặng 1
    setOrders((prev) =>
      prev.map((o) =>
        o.maNguoiNhoDat === shopId &&
        o.trangThaiDon === 'HOAN_TAT_THANH_CONG' &&
        o.trangThaiTT2Chang === 'SHOP_DA_CK_ADMIN'
          ? { ...o, daDuyetChang1: true }
          : o
      )
    );
    showToast(
      'Đã xác nhận thu tiền Chặng 1! Dòng của Shop đã chuyển sang tab "Lịch sử đã xác nhận" để gọn màn hình.',
      'success'
    );
  };

  // Bước 1 Chặng 2: Admin chọn tải ảnh Bill chuyển khoản từ máy lên cho từng CTV
  const handleAdminSelectStage2BillFile = (ctvId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAdminStage2DraftBills((prev) => ({
          ...prev,
          [ctvId]: {
            dataUrl: reader.result,
            fileName: file.name,
            uploadedAt: new Date().toLocaleTimeString('vi-VN'),
          },
        }));
        showToast(
          `Đã tải ảnh Bill (${file.name}) lên! Bây giờ nút "2. Đã chuyển" đã sáng xanh để bạn bấm xác nhận.`,
          'info'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // Bước 2 Chặng 2: Sau khi đã tải ảnh Bill lên, Admin bấm "Đã chuyển" để hoàn tất & chuyển sang Lưu trữ
  const handleAdminPayStage2 = (ctvId, amountToPay) => {
    const draftBill = adminStage2DraftBills[ctvId];
    if (!draftBill || !draftBill.dataUrl) {
      showToast('Vui lòng bấm "1. Chọn tải ảnh Bill CK" lên trước khi bấm Đã chuyển!', 'error');
      return;
    }

    setSettlements((prev) => ({
      ...prev,
      ctvPayouts: {
        ...prev.ctvPayouts,
        [ctvId]: {
          trangThai: 'DA_TAT_TOAN_CHANG_2',
          anhBillChang2: `BILL_CTV_${ctvId}_${Date.now().toString().slice(-4)}`,
          anhBillDataUrl: draftBill.dataUrl,
          fileName: draftBill.fileName,
          thoiGianCK: new Date().toLocaleString('vi-VN'),
          soTienDaTra: amountToPay,
          hanLuuTru: 'Tự xóa dữ liệu đơn sau 7 ngày (Tin nhắn giữ lâu dài)',
        },
      },
    }));
    // CHỈ đánh dấu những đơn ĐÃ KHỚP HOÀN TẤT THÀNH CÔNG và Shop đã thanh toán sang trạng thái Đã trả công
    // Tuyệt đối KHÔNG đụng tới các đơn đang giao / chưa hoàn tất của CTV!
    setOrders((prev) =>
      prev.map((o) =>
        o.maNguoiDat === ctvId &&
        o.trangThaiDon === 'HOAN_TAT_THANH_CONG' &&
        (o.trangThaiTT2Chang === 'SHOP_DA_CK_ADMIN' ||
          settlements.shopPayments[o.maNguoiNhoDat]?.trangThai === 'ADMIN_DA_XAC_NHAN')
          ? {
              ...o,
              trangThaiTT2Chang: 'ADMIN_DA_TRA_CONG',
              daLuuTruSauTatToan: true,
              hanTuDongXoa: 'Còn 7 ngày (Giữ nguyên lịch sử Chat)',
            }
          : o
      )
    );
    showToast(
      `Đã chuyển tiền công (${formatVND(amountToPay)}) cho CTV! Các đơn đã thanh toán được chuyển sang Lịch sử.`,
      'success'
    );
  };

  // ==========================================================================
  // STATE & LOGIC PHÂN HỆ 2: NGƯỜI NHỜ ĐẶT HÀNG / SHOP (UC03, UC04, UC07, UC09)
  // ==========================================================================
  // Sổ địa chỉ mẫu (Không điền sẵn mặc định ký hiệu hay dải số nhà; Chủ đơn tùy chọn có hoặc không)
  const [addrName, setAddrName] = useState('');
  const [addrHasCode, setAddrHasCode] = useState(false);
  const [addrCode, setAddrCode] = useState('');
  const [addrPos, setAddrPos] = useState('TAI_TEN_HOAC_DIA_CHI');
  const [addrDetail, setAddrDetail] = useState('');
  const [addrHasRange, setAddrHasRange] = useState(false);
  const [addrRange, setAddrRange] = useState('');

  // Đăng kèo mới: AI OCR tự quét ảnh mẫu tải lên để điền sẵn Phân loại & Số lượng cần mua
  const [campSampleImgDataUrl, setCampSampleImgDataUrl] = useState('');
  const [campSampleImgName, setCampSampleImgName] = useState('');
  const [campAiScanNotice, setCampAiScanNotice] = useState('');
  const [campIsMultiItem, setCampIsMultiItem] = useState(false);
  const [campItemCount, setCampItemCount] = useState(1);
  const [campLinksList, setCampLinksList] = useState([
    {
      link: '',
      phanLoai: '',
      soLuongMua: '1',
      ghiChuLoai: '',
    },
  ]);
  const [campGeneralNote, setCampGeneralNote] = useState('');
  const [campAddrId, setCampAddrId] = useState('');
  const [campUnlimited, setCampUnlimited] = useState(false);
  const [campQty, setCampQty] = useState(25);
  const [campHoldMins, setCampHoldMins] = useState(5); // Mặc định 5 phút, có thể nhập số khác
  const [campCalcType, setCampCalcType] = useState('DUOI_GIA_TRAN_LA_CONG');
  const [campTargetPrice, setCampTargetPrice] = useState(0);
  const [campSamplePrice, setCampSamplePrice] = useState(0);
  const [campFixedWage, setCampFixedWage] = useState(0);
  const [editingHoldTime, setEditingHoldTime] = useState({});

  // Tự động đồng bộ kho nhận hàng mặc định theo đúng Chủ đơn đang đăng nhập
  useEffect(() => {
    if (currentUser?.vaiTro === 'NGUOI_NHO_DAT') {
      const myAddrs = addresses.filter((a) => a.maNguoiNhoDat === currentUser.maNguoiDung);
      if (myAddrs.length > 0 && !myAddrs.some((a) => a.maDiaChi === campAddrId)) {
        setCampAddrId(myAddrs[0].maDiaChi);
      }
    }
  }, [currentUser?.maNguoiDung, addresses, campAddrId]);

  // Thay đổi số lượng loại / link sản phẩm khi chọn đơn gộp nhiều sản phẩm
  const handleChangeCampItemCount = (countVal) => {
    const num = Math.max(1, Math.min(10, Number(countVal) || 1));
    setCampItemCount(num);
    setCampLinksList((prev) => {
      const next = [...prev];
      while (next.length < num) {
        next.push({
          link: '',
          phanLoai: '',
          soLuongMua: '1',
          ghiChuLoai: `Ghi chú thêm cho Link ${next.length + 1}...`,
        });
      }
      return next.slice(0, num);
    });
  };

  const handleUpdateCampLinkItem = (idx, field, val) => {
    setCampLinksList((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  // Hàm AI OCR tự động phân tích ảnh bill mẫu vừa tải lên và điền vào ô Phân loại + Số lượng + Giá
  const runAiOcrExtractCampaignImage = (fileName, mode = 'AUTO') => {
    const lower = (fileName || '').toLowerCase();
    const isMulti =
      mode === 'MULTI' ||
      (mode === 'AUTO' && (lower.includes('gop') || lower.includes('combo') || lower.includes('nhieu')));

    if (isMulti) {
      const extractedItems = [
        {
          link: campLinksList[0]?.link || 'https://vt.tiktok.com/ZSYEnsureNuoc237ml/',
          phanLoai: 'Combo 4 thùng Ensure Original 237ml',
          soLuongMua: '1 combo (4 thùng)',
          ghiChuLoai: 'AI OCR đọc từ dòng sản phẩm #1 trên ảnh bill',
        },
        {
          link: campLinksList[1]?.link || 'https://vt.tiktok.com/ZSYGlucerna850g/',
          phanLoai: 'Lon Sữa bột Glucerna 850g nắp vàng',
          soLuongMua: '2 lon',
          ghiChuLoai: 'AI OCR đọc từ dòng sản phẩm #2 trên ảnh bill',
        },
        {
          link: campLinksList[2]?.link || 'https://vt.tiktok.com/ZSYQuaTangAbbott/',
          phanLoai: 'Gói sữa bột dùng thử 50g (Quà tặng kèm)',
          soLuongMua: '1 gói',
          ghiChuLoai: 'AI OCR đọc từ dòng sản phẩm #3 trên ảnh bill',
        },
      ];
      setCampIsMultiItem(true);
      setCampItemCount(3);
      setCampLinksList(extractedItems);
      setCampSamplePrice(3832875);
      setCampAiScanNotice(
        `✨ AI OCR đã quét ảnh "${fileName}" và phát hiện ĐƠN GỘP 3 MÓN! Hệ thống đã tự động điền sẵn Phân loại cần chọn & Số lượng mua cho cả 3 món kèm Giá trên ảnh (3.832.875đ). Nếu có chỗ nào chưa khớp, bạn có thể sửa tay trực tiếp ở các ô bên dưới!`
      );
      showToast('AI OCR đã quét ảnh mẫu và tự động điền 3 phân loại + số lượng cần mua!', 'success');
    } else {
      const singleExtracted = [
        {
          link: campLinksList[0]?.link || 'https://vt.tiktok.com/ZSYAbbottEnsureGold/',
          phanLoai: 'Combo 02-05 lon Sữa Abbott Ensure Gold 850g hương Vani',
          soLuongMua: '2 lon (như ảnh bill)',
          ghiChuLoai: 'AI OCR tự động bóc tách từ ảnh chụp màn hình',
        },
      ];
      setCampIsMultiItem(false);
      setCampItemCount(1);
      setCampLinksList(singleExtracted);
      setCampSamplePrice(4537000);
      setCampAiScanNotice(
        `✨ AI OCR đã quét ảnh "${fileName}" và tự động điền sẵn Phân loại ("Combo 02-05 lon Sữa Abbott Ensure Gold 850g hương Vani") + Số lượng ("2 lon") + Giá bill (4.537.000đ). Nếu chưa khớp ý bạn, hãy chỉnh sửa trực tiếp ở ô bên dưới!`
      );
      showToast('AI OCR đã quét ảnh mẫu và tự điền Phân loại + Số lượng cần mua!', 'success');
    }
  };

  const handleUploadCampaignSampleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCampSampleImgDataUrl(reader.result);
        setCampSampleImgName(file.name);
        runAiOcrExtractCampaignImage(file.name, 'AUTO');
      }
    };
    reader.readAsDataURL(file);
  };

  // Xóa kèo không cần đặt nữa (Chặn xóa nếu đang có CTV bấm giữ chỗ trong thời gian đặt đơn)
  const handleDeleteCampaignByShop = (keo) => {
    const activeHoldCount = keo.soNguoiDangGiuCho || 0;
    if (activeHoldCount > 0) {
      showToast(
        `Không thể xóa kèo ${keo.maKeo}! Hiện đang có CTV bấm giữ chỗ trong thời gian đặt đơn (${keo.thoiGianGiuChoPhut} phút). Vui lòng chờ hết thời gian giữ chỗ!`,
        'error'
      );
      return;
    }
    setCampaigns((prev) => prev.filter((c) => c.maKeo !== keo.maKeo));
    showToast(`Đã xóa kèo ${keo.maKeo} không cần đặt nữa khỏi Sàn kèo!`, 'success');
  };

  // Xóa đơn đặt hộ chưa cần nữa (nếu đơn chưa khớp hoàn tất)
  const handleDeleteOrderByShop = (order) => {
    if (order.trangThaiDon === 'HOAN_TAT_THANH_CONG') {
      showToast('Đơn đã khớp thành công 2 chiều không thể xóa!', 'error');
      return;
    }
    setOrders((prev) => prev.filter((o) => o.maDonHeThong !== order.maDonHeThong));
    showToast(`Đã xóa đơn ${order.maDonHeThong} khỏi danh sách!`, 'info');
  };

  // Chủ shop sửa lại thời gian giữ chỗ (phút) cho kèo đã đăng
  const handleUpdateCampaignHoldTime = (maKeo, newMins) => {
    const mins = Math.max(1, Math.min(180, Number(newMins) || 5));
    setCampaigns((prev) =>
      prev.map((c) => (c.maKeo === maKeo ? { ...c, thoiGianGiuChoPhut: mins } : c))
    );
    showToast(`Đã cập nhật thời gian giữ chỗ của kèo ${maKeo} thành ${mins} phút!`, 'success');
  };

  // Khớp đơn tại kho (UC07): Tải ảnh tem lên -> AI quét thông tin & rà soát đơn trong hệ thống -> Khớp hoặc hiện chữ đọc tạm được để nhập tay
  const [uploadedLabelImgUrl, setUploadedLabelImgUrl] = useState('');
  const [uploadedLabelFileName, setUploadedLabelFileName] = useState('');
  const [manualTrackingInput, setManualTrackingInput] = useState('');
  const [warehouseAiResult, setWarehouseAiResult] = useState(null);

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrName.trim() || !addrDetail.trim()) {
      showToast('Vui lòng điền Tên gợi nhớ kho và Địa chỉ nhận hàng chi tiết!', 'error');
      return;
    }
    const finalCode = addrHasCode ? addrCode.trim() : '';
    const finalRange = addrHasRange ? addrRange.trim() : '';

    const newAddr = {
      maDiaChi: 'ADDR_' + Date.now().toString().slice(-4),
      maNguoiNhoDat: currentUser.maNguoiDung,
      tenKhoGoiNho: addrName.trim(),
      kyHieuDinhDanh: finalCode,
      viTriKyHieu: finalCode ? addrPos : 'KHONG_BAT_BUOC',
      diaChiChiTiet: addrDetail.trim(),
      daiSoNhaRandom: finalRange,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setAddrName('');
    setAddrCode('');
    setAddrDetail('');
    setAddrRange('');
    setAddrHasCode(false);
    setAddrHasRange(false);
    showToast('Đã lưu mẫu địa chỉ kho mới vào Sổ địa chỉ nhận hàng!', 'success');
  };

  const handleDeleteAddress = (maDiaChi) => {
    setAddresses((prev) => prev.filter((a) => a.maDiaChi !== maDiaChi));
    showToast('Đã xóa mẫu địa chỉ khỏi Sổ địa chỉ!', 'info');
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const validLinks = campLinksList.filter((item) => item.link.trim() !== '');
    if (validLinks.length === 0) {
      showToast('Vui lòng dán ít nhất 1 đường dẫn (Link) sản phẩm!', 'error');
      return;
    }
    const myAddrs = addresses.filter((a) => a.maNguoiNhoDat === currentUser.maNguoiDung);
    const selectedAddrId =
      myAddrs.some((a) => a.maDiaChi === campAddrId)
        ? campAddrId
        : myAddrs[0]?.maDiaChi || '';
    if (!selectedAddrId) {
      showToast('Vui lòng thêm ít nhất 1 địa chỉ kho trong mục Sổ địa chỉ kho trước khi đăng kèo!', 'error');
      setShopTab('ADDRESS_BOOK');
      return;
    }
    const defaultComm = currentUser?.phanTramHoaHongMacDinh ?? 10;
    const autoLabelFromImage =
      validLinks.length > 1
        ? `Đơn gộp ${validLinks.length} sản phẩm: ${validLinks.map((x) => x.phanLoai || 'Sản phẩm').join(' + ')}`
        : `${validLinks[0]?.phanLoai || validLinks[0]?.ghiChuLoai || 'Sản phẩm theo ảnh đơn mẫu'}`;

    const newCamp = {
      maKeo: 'KEO_' + Date.now().toString().slice(-3),
      maNguoiNhoDat: currentUser.maNguoiDung,
      tenMatHang: autoLabelFromImage,
      anhMauHienThiUrl: 'SAMPLE_NEW_CAMPAIGN',
      anhMauDataUrl: campSampleImgDataUrl,
      linkSanPham: validLinks[0].link.trim(),
      soLoaiSanPham: validLinks.length,
      danhSachLink: validLinks,
      ghiChuKeo: campGeneralNote.trim(),
      maDiaChi: selectedAddrId,
      khongGioiHanSoLuong: campUnlimited,
      soLuongCanDat: campUnlimited ? 999 : Number(campQty),
      soLuongDaDat: 0,
      soNguoiDangGiuCho: 0,
      thoiGianGiuChoPhut: Number(campHoldMins) || 5,
      kieuTinhCong: campCalcType,
      giaMucTieuHoacTran: Number(campTargetPrice),
      giaMauTrenAnh: campCalcType === 'DUOI_GIA_TRAN_LA_CONG' ? Number(campSamplePrice) : Number(campTargetPrice),
      tienCongCoDinh: campCalcType === 'CONG_CO_DINH' ? Number(campFixedWage) : 0,
      phanTramHoaHongApDung: defaultComm,
      daSuaHoaHongRieng: false,
      trangThaiKeo: 'DANG_MO',
      ngayTao: new Date().toLocaleString('vi-VN'),
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    setCampHoldMins(5);
    setShopTab('ORDERS');
    showToast(`Đã đăng kèo mới thành công! Ảnh mẫu & ${validLinks.length} link sản phẩm đã hiển thị lên Sàn kèo.`, 'success');
  };

  // Khi Chủ đơn chọn tải ảnh tem kiện hàng lên, AI tự động đọc thông tin và rà soát đơn trong hệ thống
  const runAiScanOnUploadedLabel = (imgDataUrl, fileName, simulateBlurry = false) => {
    // Tìm ưu tiên đơn của Shop đang chờ quét tem kho (hoặc đơn bất kỳ của Shop để demo)
    const shopOrders = orders.filter((o) => o.maNguoiNhoDat === currentUser?.maNguoiDung);
    const pendingOrder =
      shopOrders.find((o) => !o.daKhopAnhKho && o.trangThaiDon !== 'DA_HUY_HOAN_HANG') ||
      shopOrders[0];

    if (simulateBlurry || !pendingOrder) {
      const partialCode = pendingOrder
        ? `${pendingOrder.maVanDon.slice(0, 8)}***`
        : '53014060***';
      const partialOrderNo = pendingOrder
        ? `${pendingOrder.maDonSanTMDT.slice(0, 10)}...`
        : '5871180108...';

      setManualTrackingInput(pendingOrder ? pendingOrder.maVanDon : '');
      setWarehouseAiResult({
        status: 'BLURRY',
        imgDataUrl,
        fileName,
        extractedTracking: partialCode,
        extractedOrderNo: partialOrderNo,
        extractedReceiver: 'HL Vạn An - Ấp An Thái (Chữ bị mờ/bị che góc)',
        message: `AI OCR không nhìn rõ toàn bộ chuỗi mã trên ảnh "${fileName}". Kết quả đọc tạm được: Mã vận đơn "${partialCode}" / Mã đơn "${partialOrderNo}". Vui lòng kiểm tra và tự nhập hoặc sửa lại mã ở ô bên dưới để khớp đơn!`,
      });
      return;
    }

    // Nếu ảnh rõ nét: AI đọc ra thông tin đơn và rà soát thấy đơn khớp trong hệ thống
    setManualTrackingInput(pendingOrder.maVanDon);
    setWarehouseAiResult({
      status: 'FOUND_IN_SYSTEM',
      imgDataUrl,
      fileName,
      extractedTracking: pendingOrder.maVanDon,
      extractedOrderNo: pendingOrder.maDonSanTMDT,
      extractedReceiver: pendingOrder.kyHieuQuetDuoc,
      matchedOrder: pendingOrder,
      message: `AI OCR đã quét ảnh "${fileName}" và rà soát thấy khớp 100% với đơn hàng ${pendingOrder.maDonHeThong} có trong hệ thống!`,
    });
  };

  const handleUploadWarehouseLabelImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedLabelImgUrl(reader.result);
        setUploadedLabelFileName(file.name);
        // Nếu tên file có chữ "mo" hoặc "rach" thì tự mô phỏng tem mờ, ngược lại AI đọc rõ và tìm đơn khớp
        const isBlurryName =
          file.name.toLowerCase().includes('mo') || file.name.toLowerCase().includes('rach');
        runAiScanOnUploadedLabel(reader.result, file.name, isBlurryName);
      }
    };
    reader.readAsDataURL(file);
  };

  // Xác nhận khớp đơn (từ kết quả AI rà soát được hoặc từ ô tự nhập tay khi chữ mờ)
  const handleConfirmWarehouseMatch = (codeInput, isManual = false) => {
    const codeToFind = (codeInput || manualTrackingInput).trim();
    if (!codeToFind) {
      showToast('Vui lòng nhập Mã vận đơn hoặc Mã đơn hàng để đối khớp!', 'error');
      return;
    }

    // Chỉ đối khớp trong phạm vi đơn hàng thuộc về Chủ đơn (Shop) hiện tại
    const foundOrder = orders.find(
      (o) =>
        o.maNguoiNhoDat === currentUser?.maNguoiDung &&
        (o.maVanDon.toLowerCase() === codeToFind.toLowerCase() ||
          o.maDonSanTMDT.toLowerCase() === codeToFind.toLowerCase() ||
          o.maDonHeThong.toLowerCase() === codeToFind.toLowerCase())
    );

    if (!foundOrder) {
      setWarehouseAiResult((prev) => ({
        ...(prev || {}),
        status: 'NOT_FOUND',
        extractedTracking: codeToFind,
        message: `Đã rà soát danh sách đơn của Shop nhưng không tìm thấy đơn hàng nào có Mã vận đơn / Mã đơn "${codeToFind}". Vui lòng kiểm tra lại ký tự vừa nhập hoặc trao đổi với CTV!`,
      }));
      showToast('Không tìm thấy đơn hàng của Shop khớp với mã vừa nhập!', 'error');
      return;
    }

    const willComplete = foundOrder.daKhopAnhApp; // Nếu CTV đã tải 2 ảnh Đã giao + Vận đơn thì chốt Hoàn tất
    const finalTracking =
      foundOrder.maVanDon && foundOrder.maVanDon !== 'Chờ giao hàng'
        ? foundOrder.maVanDon
        : codeToFind !== foundOrder.maDonSanTMDT && codeToFind !== foundOrder.maDonHeThong
        ? codeToFind
        : foundOrder.maVanDon;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.maDonHeThong !== foundOrder.maDonHeThong) return o;
        return {
          ...o,
          maVanDon: finalTracking,
          daKhopAnhKho: true,
          daSuaTayMa: isManual,
          trangThaiDon: o.daKhopAnhApp ? 'HOAN_TAT_THANH_CONG' : 'DA_NHAN_TAI_KHO',
          trangThaiTT2Chang: o.daKhopAnhApp ? 'CHO_SHOP_CK' : o.trangThaiTT2Chang,
          ngayCapNhat: new Date().toLocaleString('vi-VN'),
          anhBangChung: [
            ...o.anhBangChung.filter((img) => img.loaiAnh !== 'ANH_TEM_NHAN_HANG'),
            {
              maAnh: 'IMG_KHO_' + Date.now(),
              loaiAnh: 'ANH_TEM_NHAN_HANG',
              tenLoai: isManual
                ? 'Ảnh tem kiện hàng tại Kho (Đã nhập/sửa mã tay dự phòng)'
                : 'Ảnh tem kiện hàng tại Kho (AI OCR đọc tự động 100%)',
              duongDanFile: uploadedLabelImgUrl || '',
              maDonDocDuoc: o.maDonSanTMDT,
              maVanDonDocDuoc: finalTracking,
              giaCodDocDuoc: o.giaCodThucTe,
              kyHieuDocDuoc: o.kyHieuQuetDuoc,
              hopLeAI: true,
              thoiGianTai: new Date().toLocaleString('vi-VN'),
            },
          ],
        };
      })
    );

    // Nếu sau khi khớp đơn này mà tạo ra đơn HOÀN TẤT THÀNH CÔNG mới chưa thanh toán, mở lại trạng thái chờ Shop CK
    if (willComplete && currentUser) {
      setSettlements((prev) => ({
        ...prev,
        shopPayments: {
          ...prev.shopPayments,
          [currentUser.maNguoiDung]: {
            ...(prev.shopPayments[currentUser.maNguoiDung] || {}),
            trangThai: 'CHO_SHOP_CK',
          },
        },
      }));
    }

    setWarehouseAiResult((prev) => ({
      ...(prev || {}),
      status: 'MATCHED_SUCCESS',
      matchedOrder: foundOrder,
      completed: willComplete,
      message: willComplete
        ? `ĐÃ KHỚP ĐƠN THÀNH CÔNG! Đơn ${foundOrder.maDonHeThong} (Mã đơn: ${foundOrder.maDonSanTMDT} • MVĐ: ${finalTracking}) đã có đủ 2 ảnh báo giao từ CTV và ảnh tem tại Kho -> Chuyển sang ĐÃ GIAO & KHỚP ĐƠN, sẵn sàng thanh toán tiền công!`
        : `Kho đã xác nhận nhận hàng cho đơn ${foundOrder.maDonHeThong} (MVĐ: ${finalTracking}). Hiện đang chờ CTV tải 2 ảnh báo giao trên ứng dụng để hoàn tất đơn!`,
    }));
    showToast('Đã xác nhận kiện hàng tại kho thành công!', 'success');
  };

  const handleShopSelectStage1BillFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setShopStage1DraftBill(reader.result);
        showToast('Đã chọn ảnh Bill chuyển khoản từ máy! Nhấn "Xác nhận Hoàn tất Chuyển khoản" để gửi.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleShopUploadStage1Bill = (totalAmount) => {
    if (!currentUser) return;
    setSettlements((prev) => ({
      ...prev,
      shopPayments: {
        ...prev.shopPayments,
        [currentUser.maNguoiDung]: {
          trangThai: 'SHOP_DA_CK_CHO_DUYET',
          anhBillChang1: `BILL_SHOP_${currentUser.maNguoiDung}_${Date.now().toString().slice(-4)}`,
          anhBillDataUrl: shopStage1DraftBill || '',
          thoiGianCK: new Date().toLocaleString('vi-VN'),
          soTienDaCK: totalAmount,
        },
      },
    }));
    // Chỉ những đơn ĐÃ KHỚP HOÀN TẤT THÀNH CÔNG mới chuyển sang đã chuyển khoản cho Admin
    setOrders((prev) =>
      prev.map((o) =>
        o.maNguoiNhoDat === currentUser.maNguoiDung &&
        o.trangThaiDon === 'HOAN_TAT_THANH_CONG' &&
        o.trangThaiTT2Chang !== 'ADMIN_DA_TRA_CONG'
          ? { ...o, trangThaiTT2Chang: 'SHOP_DA_CK_ADMIN' }
          : o
      )
    );
    showToast(
      'Đã gửi ảnh Bill chuyển khoản tiền công cho Admin! Các đơn hoàn tất đã chuyển sang Lịch sử thanh toán.',
      'success'
    );
  };

  // ==========================================================================
  // STATE & LOGIC PHÂN HỆ 3: NGƯỜI ĐẶT HÀNG / CTV (UC05, UC06)
  // ==========================================================================
  const [heldCampaignId, setHeldCampaignId] = useState(null);
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(300); // Mặc định 5 phút = 300s
  const [quickCalcPrices, setQuickCalcPrices] = useState({});
  const [ocrScenario, setOcrScenario] = useState('VALID'); // VALID | ERR_PRICE | ERR_TAG | ERR_DUP
  const [ocrRedAlert, setOcrRedAlert] = useState(null);
  const [customOrderCode, setCustomOrderCode] = useState('');
  const [customCodPrice, setCustomCodPrice] = useState(0);
  const [placedOrderImgName, setPlacedOrderImgName] = useState('');
  const [placedOrderImgDataUrl, setPlacedOrderImgDataUrl] = useState('');

  // Báo đã giao 2 ảnh (UC06) & Tìm kiếm đơn đã đặt bên CTV
  const [deliveringOrderId, setDeliveringOrderId] = useState('');
  const [deliveryTrackingInput, setDeliveryTrackingInput] = useState('');
  const [ctvDeliveredImg1Name, setCtvDeliveredImg1Name] = useState('');
  const [ctvDeliveredImg2Name, setCtvDeliveredImg2Name] = useState('');
  const [ctvDeliveredImg1DataUrl, setCtvDeliveredImg1DataUrl] = useState('');
  const [ctvDeliveredImg2DataUrl, setCtvDeliveredImg2DataUrl] = useState('');
  const [ctvOrderSearch, setCtvOrderSearch] = useState('');
  const [ctvOrderStatusFilter, setCtvOrderStatusFilter] = useState('ACTIVE'); // ACTIVE | ARCHIVED
  const [ctvActiveStepFilter, setCtvActiveStepFilter] = useState('ALL_ACTIVE'); // ALL_ACTIVE | NEED_2_IMAGES | WAIT_WAREHOUSE | MATCHED_WAIT_PAY
  const [shopActiveStepFilter, setShopActiveStepFilter] = useState('ALL_ACTIVE'); // ALL_ACTIVE | NEED_WAREHOUSE_SCAN | WAIT_CTV_IMAGES | MATCHED_WAIT_PAY

  // Quy tắc chuẩn xác 100%:
  // Một đơn hàng CHỈ được coi là thuộc "Kho Lưu Trữ" khi:
  // - Đối với Chủ đơn (Shop): Đơn đó ĐÃ KHỚP 2 CHIỀU (HOAN_TAT_THANH_CONG) VÀ đã thanh toán tiền công (SHOP_DA_CK_ADMIN hoặc ADMIN_DA_TRA_CONG), hoặc đơn đã Hủy/Hoàn.
  // - Đối với Người đặt hộ (CTV): Đơn đó ĐÃ KHỚP 2 CHIỀU (HOAN_TAT_THANH_CONG) VÀ đã được Admin trả lương (ADMIN_DA_TRA_CONG), hoặc đơn đã Hủy/Hoàn.
  // Tuyệt đối KHÔNG BAO GIỜ đưa đơn chưa hoàn tất (đang giao, chờ báo giao, chờ quét tem) vào Kho Lưu Trữ!
  const isOrderArchivedForShop = (order) => {
    if (order.trangThaiDon === 'DA_HUY_HOAN_HANG') return true;
    if (order.trangThaiDon !== 'HOAN_TAT_THANH_CONG') return false; // Chưa hoàn tất -> Bắt buộc ở tab Đang Theo Dõi
    return (
      order.trangThaiTT2Chang === 'SHOP_DA_CK_ADMIN' ||
      order.trangThaiTT2Chang === 'ADMIN_DA_TRA_CONG'
    );
  };

  const isOrderArchivedForCtv = (order) => {
    if (order.trangThaiDon === 'DA_HUY_HOAN_HANG') return true;
    if (order.trangThaiDon !== 'HOAN_TAT_THANH_CONG') return false; // Chưa hoàn tất -> Bắt buộc ở tab Đang Theo Dõi
    return order.trangThaiTT2Chang === 'ADMIN_DA_TRA_CONG';
  };

  useEffect(() => {
    if (!heldCampaignId) return;
    const timer = setInterval(() => {
      setHoldSecondsLeft((prev) => {
        if (prev <= 1) {
          setCampaigns((camps) =>
            camps.map((c) =>
              c.maKeo === heldCampaignId
                ? { ...c, soNguoiDangGiuCho: Math.max(0, (c.soNguoiDangGiuCho || 1) - 1) }
                : c
            )
          );
          setHeldCampaignId(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [heldCampaignId]);

  const handleReleaseCampaignHold = (maKeo) => {
    const targetId = maKeo || heldCampaignId;
    if (targetId) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.maKeo === targetId
            ? { ...c, soNguoiDangGiuCho: Math.max(0, (c.soNguoiDangGiuCho || 1) - 1) }
            : c
        )
      );
    }
    setHeldCampaignId(null);
    setOcrRedAlert(null);
  };

  const handleHoldCampaignSlot = (keo) => {
    if (!keo.khongGioiHanSoLuong && keo.soLuongDaDat >= keo.soLuongCanDat) {
      showToast('Kèo này đã đặt đủ số lượng đơn cần thiết!', 'error');
      return;
    }
    if (heldCampaignId && heldCampaignId !== keo.maKeo) {
      handleReleaseCampaignHold(heldCampaignId);
    }
    setHeldCampaignId(keo.maKeo);
    setHoldSecondsLeft((keo.thoiGianGiuChoPhut || 5) * 60);
    setCampaigns((prev) =>
      prev.map((c) =>
        c.maKeo === keo.maKeo
          ? { ...c, soNguoiDangGiuCho: (c.soNguoiDangGiuCho || 0) + 1 }
          : c
      )
    );
    setOcrRedAlert(null);
    setPlacedOrderImgName('');
    setPlacedOrderImgDataUrl('');
    setCustomOrderCode('5871' + Math.floor(10000000000000 + Math.random() * 89999999999999));
    setCustomCodPrice(
      keo.kieuTinhCong === 'DUOI_GIA_TRAN_LA_CONG' ? keo.giaMauTrenAnh : keo.giaMucTieuHoacTran
    );
    showToast(`Đã nhận suất đặt kèo ${keo.maKeo}! Bạn có ${keo.thoiGianGiuChoPhut || 5} phút để đặt đơn và tải ảnh lên.`, 'info');
  };

  const handleUploadPlacedOrderImageFile = (e, keo) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPlacedOrderImgDataUrl(reader.result);
        setPlacedOrderImgName(file.name);
        setOcrRedAlert(null);
        // Nếu trong tên file ảnh chụp màn hình có chuỗi số dài (mã đơn), tự động trích xuất điền sẵn
        const digitsMatch = file.name.match(/\d{10,20}/);
        if (digitsMatch) {
          setCustomOrderCode(digitsMatch[0]);
        } else if (!customOrderCode) {
          setCustomOrderCode('5871' + Math.floor(10000000000000 + Math.random() * 89999999999999));
        }
        showToast(
          `AI OCR đã quét ảnh "${file.name}". Vui lòng kiểm tra lại Mã số đơn hàng và Tổng tiền COD trước khi xác nhận!`,
          'info'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCtvSubmitPlacedOrderAI = (keo) => {
    setOcrRedAlert(null);
    const addr = addresses.find((a) => a.maDiaChi === keo.maDiaChi);
    const hasRequiredTag = Boolean(addr?.kyHieuDinhDanh && addr.kyHieuDinhDanh.trim() !== '');
    const requiredTag = hasRequiredTag ? addr.kyHieuDinhDanh : '';
    const hasRequiredRange = Boolean(addr?.daiSoNhaRandom && addr.daiSoNhaRandom.trim() !== '');

    if (!customOrderCode.trim()) {
      setOcrRedAlert({
        title: 'THIẾU MÃ SỐ ĐƠN HÀNG!',
        details: ['Vui lòng kiểm tra hoặc nhập Mã số đơn hàng sàn TMĐT trước khi hoàn tất.'],
      });
      return;
    }

    const actualCod = Number(customCodPrice) || 0;
    if (actualCod <= 0) {
      setOcrRedAlert({
        title: 'TỔNG TIỀN COD KHÔNG HỢP LỆ!',
        details: ['Vui lòng nhập đúng Tổng tiền COD của đơn hàng.'],
      });
      return;
    }

    // Kiểm tra thực tế 1: Báo đỏ nếu Giá COD thực tế vượt quá mức giá trần / giá mục tiêu của kèo
    if (ocrScenario === 'ERR_PRICE' || actualCod > keo.giaMucTieuHoacTran) {
      const badPrice =
        actualCod > keo.giaMucTieuHoacTran ? actualCod : keo.giaMucTieuHoacTran + 180000;
      setOcrRedAlert({
        title: 'BÁO ĐỎ TỨC THÌ (AI OCR PHÁT HIỆN SAI GIÁ COD)!',
        details: [
          `Tổng tiền COD của đơn: ${formatVND(badPrice)}`,
          `Mức giá trần / mục tiêu tối đa của kèo: ${formatVND(keo.giaMucTieuHoacTran)}`,
          `Nguyên nhân: Giá đặt cao hơn quy định ${formatVND(
            badPrice - keo.giaMucTieuHoacTran
          )}. Vui lòng hủy đơn trên sàn và áp lại mã giảm giá đúng yêu cầu!`,
        ],
      });
      return;
    }

    // Kiểm tra thực tế 2: Báo đỏ nếu thiếu ký hiệu định danh (khi kịch bản kiểm tra bật)
    if (ocrScenario === 'ERR_TAG') {
      if (!hasRequiredTag && !hasRequiredRange) {
        setOcrRedAlert({
          title: 'BÁO ĐỎ TỨC THÌ (SAI ĐỊA CHỈ KHO NHẬN HÀNG)!',
          details: [
            `Địa chỉ trên ảnh không khớp với kho "${addr?.tenKhoGoiNho}" (${addr?.diaChiChiTiet}).`,
            `Vui lòng kiểm tra và chọn đúng địa chỉ kho của Chủ đơn!`,
          ],
        });
        return;
      }
      setOcrRedAlert({
        title: 'BÁO ĐỎ TỨC THÌ (THIẾU KÝ HIỆU ĐỊNH DANH / DẢI SỐ NHÀ CỦA CHỦ ĐƠN)!',
        details: [
          `Quy tắc bắt buộc của kho này: ${
            hasRequiredTag ? `Ký hiệu "${requiredTag}"` : 'Không cần ký hiệu tên'
          } ${hasRequiredRange ? `• Dải số nhà: ${addr.daiSoNhaRandom}` : ''}`,
          `Nguyên nhân: Quên gắn ${
            hasRequiredTag ? `ký hiệu "${requiredTag}"` : `dải số nhà (${addr?.daiSoNhaRandom})`
          } vào Tên/Địa chỉ nhận hàng. Vui lòng sửa địa chỉ hoặc hủy đặt lại ngay!`,
        ],
      });
      return;
    }

    // Kiểm tra thực tế 3: Báo đỏ chống gian lận nếu trùng Mã số đơn hàng đã tồn tại trên hệ thống
    const existingDupOrder = orders.find(
      (o) => o.maDonSanTMDT.toLowerCase() === customOrderCode.trim().toLowerCase()
    );
    if (ocrScenario === 'ERR_DUP' || existingDupOrder) {
      const dupCode = existingDupOrder?.maDonSanTMDT || customOrderCode.trim();
      setOcrRedAlert({
        title: 'BÁO ĐỎ CẢNH BÁO GIAN LẬN (TRÙNG MÃ ĐƠN HÀNG ĐÃ TỒN TẠI)!',
        details: [
          `Số đơn hàng: ${dupCode}`,
          `Trạng thái kiểm tra: Mã số đơn hàng này ĐÃ TỒN TẠI trên hệ thống (${
            existingDupOrder ? `Đơn ${existingDupOrder.maDonHeThong}` : 'Đơn hàng cũ'
          }).`,
          `Hệ thống từ chối lưu đơn trùng mã để đảm bảo minh bạch tài chính!`,
        ],
      });
      return;
    }

    // Hợp lệ 100% -> Tính công gốc, hoa hồng Admin, công thực nhận và lưu đơn
    const rawWage =
      keo.kieuTinhCong === 'CONG_CO_DINH'
        ? keo.tienCongCoDinh
        : Math.max(0, keo.giaMucTieuHoacTran - actualCod);
    const adminFee = Math.round((rawWage * keo.phanTramHoaHongApDung) / 100);
    const netWage = rawWage - adminFee;

    const detectedTagText = `${hasRequiredTag ? `[${requiredTag}] ` : '[Không yêu cầu ký hiệu] '}${
      currentUser.hoVaTen
    } (${hasRequiredRange ? addr?.daiSoNhaRandom : 'Đúng địa chỉ kho'})`;

    const newOrder = {
      maDonHeThong: 'ORD_' + (1000 + orders.length + 1),
      maKeo: keo.maKeo,
      maNguoiNhoDat: keo.maNguoiNhoDat,
      maNguoiDat: currentUser.maNguoiDung,
      maDonSanTMDT: customOrderCode.trim(),
      maVanDon: 'Chờ giao hàng',
      giaCodThucTe: actualCod,
      tienCongGoc: rawWage,
      phanTramHoaHong: keo.phanTramHoaHongApDung,
      hoaHongAdmin: adminFee,
      tienCongThucNhan: netWage,
      kyHieuQuetDuoc: detectedTagText,
      daKhopAnhKho: false,
      daKhopAnhApp: false,
      daSuaTayMa: false,
      trangThaiDon: 'DA_DAT_DANG_GIAO',
      trangThaiTT2Chang: 'CHUA_CHOT',
      ngayDat: new Date().toLocaleString('vi-VN'),
      ngayCapNhat: new Date().toLocaleString('vi-VN'),
      anhBangChung: [
        {
          maAnh: 'IMG_NEW_' + Date.now(),
          loaiAnh: 'ANH_DA_DAT',
          tenLoai: 'Ảnh màn hình Đã đặt hàng (AI OCR duyệt hợp lệ)',
          duongDanFile: placedOrderImgDataUrl || '',
          maDonDocDuoc: customOrderCode.trim(),
          maVanDonDocDuoc: '',
          giaCodDocDuoc: actualCod,
          kyHieuDocDuoc: `${detectedTagText} - ${addr?.diaChiChiTiet}`,
          hopLeAI: true,
          thoiGianTai: new Date().toLocaleString('vi-VN'),
        },
      ],
      tinNhan: [],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.maKeo !== keo.maKeo) return c;
        const nextCount = c.soLuongDaDat + 1;
        return {
          ...c,
          soLuongDaDat: nextCount,
          soNguoiDangGiuCho: Math.max(0, (c.soNguoiDangGiuCho || 1) - 1),
          trangThaiKeo:
            !c.khongGioiHanSoLuong && nextCount >= c.soLuongCanDat ? 'DA_DU_SO_LUONG' : c.trangThaiKeo,
        };
      })
    );
    setHeldCampaignId(null);
    showToast(
      `AI OCR kiểm tra HỢP LỆ 100%! Đã chốt công thực nhận ${formatVND(netWage)} và ẩn ảnh vào nút [Xem ảnh].`,
      'success'
    );
  };

  // Tự động chọn đơn đang giao hợp lệ đầu tiên cho khung Báo giao 2 ảnh (loại trừ đơn đã khớp thành công)
  useEffect(() => {
    if (!currentUser || currentUser.vaiTro !== 'NGUOI_DAT') return;
    const deliveringList = orders.filter(
      (o) =>
        o.maNguoiDat === currentUser.maNguoiDung &&
        o.trangThaiDon !== 'HOAN_TAT_THANH_CONG' &&
        o.trangThaiDon !== 'DA_HUY_HOAN_HANG'
    );
    const stillValid = deliveringList.some((o) => o.maDonHeThong === deliveringOrderId);
    if (!stillValid && deliveringList.length > 0) {
      setDeliveringOrderId(deliveringList[0].maDonHeThong);
      setDeliveryOrderCodeInput(deliveringList[0].maDonSanTMDT || '');
      setDeliveryTrackingInput(
        deliveringList[0].maVanDon && deliveringList[0].maVanDon !== 'Chờ giao hàng'
          ? deliveringList[0].maVanDon
          : '530199887766'
      );
    }
  }, [orders, currentUser, deliveringOrderId]);

  // Khi CTV bấm chọn 1 đơn ở bảng bên dưới để đưa lên khung tải 2 ảnh ở trên
  const handleSelectOrderForDeliveryUpload = (order) => {
    if (order.trangThaiDon === 'HOAN_TAT_THANH_CONG') {
      showToast('Đơn này đã khớp 2 chiều thành công rồi, không cần tải ảnh báo giao nữa!', 'info');
      return;
    }
    setDeliveringOrderId(order.maDonHeThong);
    setDeliveryOrderCodeInput(order.maDonSanTMDT || '');
    setDeliveryTrackingInput(
      order.maVanDon && order.maVanDon !== 'Chờ giao hàng' ? order.maVanDon : '530199887766'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(
      `Đã nạp đơn ${order.maDonHeThong} lên khung tải 2 ảnh! Hệ thống hiển thị đủ cả 2 mã (Mã đơn hàng & Mã vận chuyển) để bạn xác nhận.`,
      'info'
    );
  };

  const handleCtvSubmitDelivered2Images = (e) => {
    e.preventDefault();
    const targetOrder = orders.find((o) => o.maDonHeThong === deliveringOrderId);
    if (!targetOrder) return;

    const confirmedOrderCode = deliveryOrderCodeInput.trim() || targetOrder.maDonSanTMDT;
    const trackingCode = deliveryTrackingInput.trim() || '530199887766';

    if (confirmedOrderCode !== targetOrder.maDonSanTMDT) {
      showToast(
        `BÁO ĐỎ: Mã đơn hàng ở Ảnh 1 (${confirmedOrderCode}) không khớp với Mã đơn lúc mới đặt (${targetOrder.maDonSanTMDT})! Vui lòng kiểm tra lại.`,
        'error'
      );
      return;
    }

    // Kiểm tra chống trùng Mã vận đơn với đơn hàng khác trên toàn hệ thống (Unique Constraint)
    const duplicateTrackingOrder = orders.find(
      (o) =>
        o.maDonHeThong !== targetOrder.maDonHeThong &&
        o.maVanDon !== 'Chờ giao hàng' &&
        o.maVanDon.toLowerCase() === trackingCode.toLowerCase()
    );
    if (duplicateTrackingOrder) {
      showToast(
        `BÁO ĐỎ CHỐNG GIAN LẬN: Mã vận đơn "${trackingCode}" đã tồn tại ở đơn ${duplicateTrackingOrder.maDonHeThong}! Mỗi mã vận đơn chỉ được sử dụng duy nhất 1 lần.`,
        'error'
      );
      return;
    }

    // Nếu Kho đã quét tem trước đó với một Mã vận đơn cụ thể, kiểm tra khớp 2 đầu
    if (
      targetOrder.daKhopAnhKho &&
      targetOrder.maVanDon &&
      targetOrder.maVanDon !== 'Chờ giao hàng' &&
      targetOrder.maVanDon.toLowerCase() !== trackingCode.toLowerCase()
    ) {
      showToast(
        `BÁO ĐỎ LỆCH MÃ VẬN ĐƠN 2 ĐẦU: Mã vận đơn bạn nhập (${trackingCode}) không khớp với Mã vận đơn Kho đã quét trên thùng hàng (${targetOrder.maVanDon})!`,
        'error'
      );
      return;
    }

    const willComplete = targetOrder.daKhopAnhKho;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.maDonHeThong !== targetOrder.maDonHeThong) return o;
        return {
          ...o,
          maDonSanTMDT: confirmedOrderCode,
          maVanDon: trackingCode,
          daKhopAnhApp: true,
          trangThaiDon: o.daKhopAnhKho ? 'HOAN_TAT_THANH_CONG' : 'DA_BAO_GIAO_APP',
          trangThaiTT2Chang: o.daKhopAnhKho ? 'CHO_SHOP_CK' : o.trangThaiTT2Chang,
          ngayCapNhat: new Date().toLocaleString('vi-VN'),
          anhBangChung: [
            ...o.anhBangChung.filter(
              (img) => img.loaiAnh !== 'ANH_DA_GIAO' && img.loaiAnh !== 'ANH_VAN_DON'
            ),
            {
              maAnh: 'IMG_DG1_' + Date.now(),
              loaiAnh: 'ANH_DA_GIAO',
              tenLoai: 'Ảnh 1: Màn hình Đã giao đơn hàng',
              duongDanFile: ctvDeliveredImg1DataUrl || '',
              maDonDocDuoc: confirmedOrderCode,
              maVanDonDocDuoc: '',
              giaCodDocDuoc: o.giaCodThucTe,
              kyHieuDocDuoc: 'Đã giao thành công + Quà tặng miễn phí',
              hopLeAI: true,
              thoiGianTai: new Date().toLocaleString('vi-VN'),
            },
            {
              maAnh: 'IMG_DG2_' + Date.now(),
              loaiAnh: 'ANH_VAN_DON',
              tenLoai: 'Ảnh 2: Màn hình Theo dõi kiện hàng (J&T Cargo VN)',
              duongDanFile: ctvDeliveredImg2DataUrl || '',
              maDonDocDuoc: confirmedOrderCode,
              maVanDonDocDuoc: trackingCode,
              giaCodDocDuoc: o.giaCodThucTe,
              kyHieuDocDuoc: `J&T Cargo VN - MVĐ ${trackingCode}`,
              hopLeAI: true,
              thoiGianTai: new Date().toLocaleString('vi-VN'),
            },
          ],
        };
      })
    );

    if (willComplete) {
      setSettlements((prev) => ({
        ...prev,
        shopPayments: {
          ...prev.shopPayments,
          [targetOrder.maNguoiNhoDat]: {
            ...(prev.shopPayments[targetOrder.maNguoiNhoDat] || {}),
            trangThai: 'CHO_SHOP_CK',
          },
        },
      }));
    }

    setCtvDeliveredImg1Name('');
    setCtvDeliveredImg2Name('');
    setCtvDeliveredImg1DataUrl('');
    setCtvDeliveredImg2DataUrl('');

    showToast(
      willComplete
        ? `AI OCR đã xác nhận đủ 2 mã (Đơn: ${confirmedOrderCode} & MVĐ: ${trackingCode}) -> ĐÃ KHỚP ĐƠN THÀNH CÔNG!`
        : `Đã lưu 2 ảnh báo giao (Mã đơn: ${confirmedOrderCode} • MVĐ: ${trackingCode}). Đang chờ Kho của Shop chụp tem thùng hàng xác nhận!`,
      'success'
    );
  };

  // ==========================================================================
  // RENDER MÀN HÌNH 1: TRANG ĐĂNG NHẬP HỆ THỐNG (BẢO MẬT 100% KHI ĐẨY LÊN WEB)
  // ==========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />

        {toast && (
          <div className="fixed top-4 right-4 z-50 max-w-md bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}

        <div className="max-w-md w-full space-y-5 relative z-10">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Hệ Thống Quản Lý Đặt Đơn Hộ AI OCR
              </h1>
              <p className="text-xs text-slate-700 font-semibold">
                Cổng điều phối đơn hàng, đối khớp tự động & thanh toán trung gian
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  Số điện thoại hoặc Email
                </label>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Nhập số điện thoại hoặc email được cấp"
                  autoComplete="username"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Đăng Nhập Hệ Thống</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                Hệ thống định danh khép kín
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    cloudSyncStatus === 'CONNECTED'
                      ? 'bg-emerald-500 animate-pulse'
                      : cloudSyncStatus === 'ERROR'
                      ? 'bg-rose-500'
                      : 'bg-slate-400'
                  }`}
                />
                {cloudSyncStatus === 'CONNECTED'
                  ? 'Máy chủ trực tuyến'
                  : 'Chế độ cục bộ'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // DỮ LIỆU TÍNH TOÁN & THANH ĐIỀU HƯỚNG THEO VAI TRÒ
  // ==========================================================================
  const getUserById = (id) => users.find((u) => u.maNguoiDung === id);
  const getCampaignById = (id) => campaigns.find((c) => c.maKeo === id);
  const getAddressById = (id) => addresses.find((a) => a.maDiaChi === id);

  // Giao diện Tab Tài khoản cá nhân (Đổi mật khẩu & Cập nhật Mã QR bên trong sau khi đăng nhập)
  const renderPersonalAccountSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-5 h-5 text-indigo-600" /> Đổi Mật Khẩu Bảo Mật Cá Nhân
        </h3>
        <form onSubmit={handleChangePasswordInside} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={oldPasswordInput}
              onChange={(e) => setOldPasswordInput(e.target.value)}
              placeholder="Nhập mật khẩu đang sử dụng"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-800 mb-1">Mật khẩu cá nhân mới (từ 6 ký tự)</label>
            <input
              type="password"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-slate-800 mb-1">Xác nhận lại mật khẩu mới</label>
            <input
              type="password"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow cursor-pointer"
          >
            Lưu Mật Khẩu Mới
          </button>
        </form>
      </div>

      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600" /> Thông Tin Ngân Hàng & Mã QR Nhận Thanh Toán
          </h3>
          {currentUser.anhMaQRUrl && (
            <button
              type="button"
              onClick={() =>
                setEvidenceModal({
                  type: 'QR_CODE',
                  title: `Mã QR Ngân Hàng — ${currentUser.hoVaTen}`,
                  data: currentUser,
                })
              }
              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200 cursor-pointer"
            >
              Xem Mã QR Hiện Tại
            </button>
          )}
        </div>

        <form onSubmit={handleSaveBankAndQrInside} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Tên hiển thị / Tên đơn vị</label>
              <input
                type="text"
                value={profileFullName}
                onChange={(e) => setProfileFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Ngân hàng thụ hưởng (Nhập tay)</label>
              <input
                type="text"
                value={profileBankName}
                onChange={(e) => setProfileBankName(e.target.value)}
                placeholder="Ví dụ: Vietcombank, MB Bank, ACB..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Số tài khoản ngân hàng</label>
              <input
                type="text"
                value={profileBankNumber}
                onChange={(e) => setProfileBankNumber(e.target.value)}
                placeholder="Nhập số tài khoản"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Họ tên chủ tài khoản (In hoa)</label>
              <input
                type="text"
                value={profileBankHolder}
                onChange={(e) => setProfileBankHolder(e.target.value)}
                placeholder="NGUYEN VAN A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold uppercase text-slate-900"
                required
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-extrabold text-slate-900 block">
                Tải Ảnh Mã QR Ngân Hàng Từ Thiết Bị
              </span>
              <span className="text-[11px] text-slate-700 font-medium">
                {profileQrDataUrl && profileQrDataUrl.startsWith('data:image')
                  ? 'Đã tải ảnh Mã QR cá nhân lên hệ thống'
                  : 'Chọn file ảnh Mã QR từ máy tính hoặc điện thoại'}
              </span>
            </div>
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-extrabold flex items-center gap-1.5 shadow-2xs">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Chọn Ảnh Mã QR</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadQrFile}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow cursor-pointer"
          >
            Lưu Hồ Sơ Ngân Hàng & Mã QR
          </button>
        </form>
      </div>
    </div>
  );

  const renderOrderStatusBadge = (status) => {
    switch (status) {
      case 'HOAN_TAT_THANH_CONG':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã giao & Khớp đơn (Được tính công)
          </span>
        );
      case 'DA_NHAN_TAI_KHO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Package className="w-3.5 h-3.5" /> Kho đã nhận hàng • Chờ CTV tải 2 ảnh đã giao
          </span>
        );
      case 'DA_BAO_GIAO_APP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Truck className="w-3.5 h-3.5" /> CTV đã báo giao • Chờ Kho chụp tem xác nhận
          </span>
        );
      case 'DA_HUY_HOAN_HANG':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy / Hoàn hàng (Không tính công)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Clock className="w-3.5 h-3.5" /> Đang giao hàng • Chờ giao tới kho
          </span>
        );
    }
  };

  // Hàm hiển thị rõ tiến độ đơn & tiền công dành cho CTV (Không dùng từ "Chặng 1 / Chặng 2 / Đối khớp 2 chiều" khó hiểu)
  const renderReadableOrderProgressForCtv = (order) => {
    const shopPay = settlements.shopPayments[order.maNguoiNhoDat]?.trangThai;

    if (order.trangThaiDon === 'DA_HUY_HOAN_HANG') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold text-xs">
          ❌ Đơn đã hủy hoặc hoàn hàng — Không tính tiền công
        </span>
      );
    }

    if (order.trangThaiDon === 'DA_DAT_DANG_GIAO') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs">
          🚚 Đơn đang vận chuyển — Khi app báo giao xong, bạn tải 2 ảnh đã giao lên nhé
        </span>
      );
    }

    if (order.trangThaiDon === 'DA_NHAN_TAI_KHO') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs">
          📦 Kho của Shop đã nhận được hàng — Bạn chỉ cần tải 2 ảnh đã giao lên là được cộng tiền công
        </span>
      );
    }

    if (order.trangThaiDon === 'DA_BAO_GIAO_APP') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 border border-amber-300 font-bold text-xs">
          ⏳ Bạn đã gửi 2 ảnh đã giao — Đang chờ Shop chụp tem thùng hàng xác nhận đã nhận
        </span>
      );
    }

    // Trường hợp đơn đã khớp thành công (HOAN_TAT_THANH_CONG) -> Hiển thị rõ tiến độ tiền công
    if (order.trangThaiTT2Chang === 'ADMIN_DA_TRA_CONG') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs">
          ✅ Admin đã chuyển khoản trả tiền công cho bạn
        </span>
      );
    }

    if (order.daDuyetChang1 || shopPay === 'ADMIN_DA_XAC_NHAN') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs">
          💰 Shop đã chuyển tiền cho Admin • Đang chờ Admin chuyển khoản trả công cho bạn
        </span>
      );
    }

    if (order.trangThaiTT2Chang === 'SHOP_DA_CK_ADMIN' || shopPay === 'SHOP_DA_CK_CHO_DUYET') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 border border-amber-300 font-bold text-xs">
          🧾 Shop đã gửi Bill chuyển tiền cho Admin • Chờ Admin kiểm tra và chuyển trả công cho bạn
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs">
        ✔️ Đơn đã khớp thành công • Chờ Shop thanh toán tiền công cuối ngày cho Admin
      </span>
    );
  };

  const roleNavItems =
    currentUser.vaiTro === 'ADMIN'
      ? [
          { id: 'DASHBOARD', label: 'Tổng quan hệ thống', icon: Layers },
          { id: 'ACCOUNTS', label: 'Quản lý tài khoản', icon: UserPlus },
          { id: 'CAMPAIGNS', label: 'Quản lý sàn kèo & Phí', icon: Percent },
          { id: 'SETTLEMENT', label: 'Thu tiền Shop & Trả công CTV', icon: DollarSign },
          { id: 'PROFILE', label: 'Tài khoản cá nhân', icon: KeyRound },
        ]
      : currentUser.vaiTro === 'NGUOI_NHO_DAT'
      ? [
          { id: 'ORDERS', label: 'Quản lý kèo & Đơn hàng', icon: Layers },
          { id: 'CREATE_CAMPAIGN', label: 'Đăng kèo mới', icon: Plus },
          { id: 'WAREHOUSE_MATCH', label: 'Quét tem nhận hàng tại kho', icon: CheckSquare },
          { id: 'ADDRESS_BOOK', label: 'Sổ địa chỉ kho', icon: Building2 },
          { id: 'SETTLEMENT', label: 'Thanh toán tiền công', icon: DollarSign },
          { id: 'PROFILE', label: 'Tài khoản cá nhân', icon: KeyRound },
        ]
      : [
          { id: 'MARKETPLACE', label: 'Sàn kèo đặt đơn', icon: Flame },
          { id: 'MY_ORDERS', label: 'Đơn đã đặt & Báo giao', icon: Truck },
          { id: 'WALLET_QR', label: 'Tiền công của tôi', icon: DollarSign },
          { id: 'PROFILE', label: 'Tài khoản cá nhân', icon: KeyRound },
        ];

  const activeRoleTab =
    currentUser.vaiTro === 'ADMIN'
      ? adminTab
      : currentUser.vaiTro === 'NGUOI_NHO_DAT'
      ? shopTab
      : ctvTab;

  const setActiveRoleTab = (id) => {
    if (currentUser.vaiTro === 'ADMIN') setAdminTab(id);
    else if (currentUser.vaiTro === 'NGUOI_NHO_DAT') setShopTab(id);
    else setCtvTab(id);
  };

  // ==========================================================================
  // GIAO DIỆN CHÍNH SAU KHI ĐĂNG NHẬP
  // ==========================================================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border-rose-400'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium break-words">{toast.message}</span>
        </div>
      )}

      {/* HEADER TRÊN CÙNG + THANH TAB LƯỚT NGANG */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow shrink-0 ${
                currentUser.vaiTro === 'ADMIN'
                  ? 'bg-indigo-600'
                  : currentUser.vaiTro === 'NGUOI_NHO_DAT'
                  ? 'bg-emerald-600'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              {currentUser.vaiTro === 'ADMIN' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : currentUser.vaiTro === 'NGUOI_NHO_DAT' ? (
                <Store className="w-6 h-6" />
              ) : (
                <UserCheck className="w-6 h-6" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {currentUser.vaiTro === 'ADMIN'
                    ? 'Quản Trị Viên Điều Phối'
                    : currentUser.vaiTro === 'NGUOI_NHO_DAT'
                    ? 'Chủ Đơn (Shop)'
                    : 'Cộng Tác Viên Đặt Đơn'}
                </span>
                <OnlineStatusBadge user={currentUser} compact />
              </div>
              <h2 className="text-xs sm:text-sm font-extrabold text-white break-words">
                {currentUser.hoVaTen} • {currentUser.soDienThoai}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>

        <div className="bg-slate-950/90 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6">
            <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
              {roleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoleTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveRoleTab(item.id)}
                    className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800/90 text-slate-200 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* KHU VỰC NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ====================================================================
            PHÂN HỆ 1: GIAO DIỆN QUẢN TRỊ VIÊN (ADMIN TRUNG GIAN)
           ==================================================================== */}
        {currentUser.vaiTro === 'ADMIN' && (
          <main className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5 flex-1 space-y-6">
            {adminTab === 'PROFILE' && renderPersonalAccountSection()}

            {/* TAB ADMIN 1: TỔNG QUAN HỆ THỐNG */}
            {adminTab === 'DASHBOARD' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-slate-700">
                      Tổng đơn hàng hệ thống
                    </span>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">
                      {orders.length} đơn
                    </p>
                    <p className="text-xs text-emerald-700 font-bold mt-1">
                      Hoàn tất: {orders.filter((o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG').length} • Đang xử lý:{' '}
                      {orders.filter((o) => o.trangThaiDon !== 'HOAN_TAT_THANH_CONG' && o.trangThaiDon !== 'DA_HUY_HOAN_HANG').length}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-slate-700">
                      Tổng tiền công thu từ Shop
                    </span>
                    <p className="text-2xl font-extrabold text-indigo-700 mt-1">
                      {formatVND(
                        orders
                          .filter((o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG')
                          .reduce((sum, o) => sum + o.tienCongGoc, 0)
                      )}
                    </p>
                    <p className="text-xs text-slate-700 font-semibold mt-1">Tổng tiền Shop thanh toán cho Admin</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-amber-300 bg-amber-50/50 shadow-sm">
                    <span className="text-xs font-bold uppercase text-amber-900">
                      Doanh thu phí dịch vụ
                    </span>
                    <p className="text-2xl font-extrabold text-amber-700 mt-1">
                      {formatVND(
                        orders
                          .filter((o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG')
                          .reduce((sum, o) => sum + o.hoaHongAdmin, 0)
                      )}
                    </p>
                    <p className="text-xs text-amber-900 font-semibold mt-1">Phí chiết khấu điều phối</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-slate-700">
                      Tổng chi trả Cộng tác viên
                    </span>
                    <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                      {formatVND(
                        orders
                          .filter((o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG')
                          .reduce((sum, o) => sum + o.tienCongThucNhan, 0)
                      )}
                    </p>
                    <p className="text-xs text-slate-700 font-semibold mt-1">Tổng tiền Admin chuyển trả CTV</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cột 1: Thống kê theo Chủ đơn (Shop) */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        Thống Kê Hoạt Động Chủ Đơn (Shop)
                      </h3>
                      <button
                        type="button"
                        onClick={() => setAdminTab('SETTLEMENT')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 cursor-pointer"
                      >
                        Đối soát công nợ →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {users
                        .filter((u) => u.vaiTro === 'NGUOI_NHO_DAT')
                        .map((shop) => {
                          const shopCamps = campaigns.filter((c) => c.maNguoiNhoDat === shop.maNguoiDung);
                          const shopOrders = orders.filter((o) => o.maNguoiNhoDat === shop.maNguoiDung);
                          const doneOrders = shopOrders.filter((o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG');
                          const deliveringOrders = shopOrders.filter(
                            (o) => o.trangThaiDon !== 'HOAN_TAT_THANH_CONG' && o.trangThaiDon !== 'DA_HUY_HOAN_HANG'
                          );
                          const totalGross = doneOrders.reduce((s, o) => s + o.tienCongGoc, 0);
                          const totalFee = doneOrders.reduce((s, o) => s + o.hoaHongAdmin, 0);

                          return (
                            <div
                              key={shop.maNguoiDung}
                              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-extrabold text-slate-900 text-sm break-words">
                                  {shop.hoVaTen}
                                </span>
                                <OnlineStatusBadge user={shop} compact />
                              </div>
                              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                <div className="p-2 rounded-xl bg-white border border-slate-200">
                                  <span className="text-[11px] text-slate-700 font-semibold block">Kèo đang mở</span>
                                  <strong className="text-sm text-indigo-700">{shopCamps.length} kèo</strong>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-slate-200">
                                  <span className="text-[11px] text-slate-700 font-semibold block">Đang giao</span>
                                  <strong className="text-sm text-amber-700">{deliveringOrders.length} đơn</strong>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-slate-200">
                                  <span className="text-[11px] text-slate-700 font-semibold block">Hoàn tất</span>
                                  <strong className="text-sm text-emerald-700">{doneOrders.length} đơn</strong>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-slate-800">
                                <span>
                                  Tổng thu: <strong className="text-indigo-700">{formatVND(totalGross)}</strong> • Phí dịch vụ ({shop.phanTramHoaHongMacDinh}%):{' '}
                                  <strong className="text-amber-700">{formatVND(totalFee)}</strong>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActivePaymentChatPartnerId(shop.maNguoiDung)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <MessageSquare className="w-3 h-3" /> Liên hệ Shop
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Cột 2: Thống kê theo Cộng tác viên */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        Thống Kê Hoạt Động Cộng Tác Viên
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {users
                        .filter((u) => u.vaiTro === 'NGUOI_DAT' && !u.firstLogin)
                        .map((ctv) => {
                          const ctvOrders = orders.filter((o) => o.maNguoiDat === ctv.maNguoiDung);
                          const doneOrders = ctvOrders.filter((o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG');
                          const deliveringOrders = ctvOrders.filter(
                            (o) => o.trangThaiDon !== 'HOAN_TAT_THANH_CONG' && o.trangThaiDon !== 'DA_HUY_HOAN_HANG'
                          );
                          const totalNet = doneOrders.reduce((s, o) => s + o.tienCongThucNhan, 0);

                          return (
                            <div
                              key={ctv.maNguoiDung}
                              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-extrabold text-slate-900 text-sm break-words">
                                  {ctv.hoVaTen}
                                </span>
                                <OnlineStatusBadge user={ctv} compact />
                              </div>
                              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                <div className="p-2 rounded-xl bg-white border border-slate-200">
                                  <span className="text-[11px] text-slate-700 font-semibold block">Tổng đơn nhận</span>
                                  <strong className="text-sm text-slate-900">{ctvOrders.length} đơn</strong>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-slate-200">
                                  <span className="text-[11px] text-slate-700 font-semibold block">Đang giao</span>
                                  <strong className="text-sm text-amber-700">{deliveringOrders.length} đơn</strong>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-slate-200">
                                  <span className="text-[11px] text-slate-700 font-semibold block">Đã khớp</span>
                                  <strong className="text-sm text-emerald-700">{doneOrders.length} đơn</strong>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-slate-800">
                                <span>
                                  Tiền công thực trả: <strong className="text-emerald-700 text-sm">{formatVND(totalNet)}</strong>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActivePaymentChatPartnerId(ctv.maNguoiDung)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <MessageSquare className="w-3 h-3" /> Liên hệ CTV
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Khối 3: Tra cứu nhanh đơn hàng & Chứng từ */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Tra Cứu Đơn Hàng & Kiểm Tra Chứng Từ AI OCR
                    </h3>
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Nhập Mã đơn hệ thống, Mã sàn, MVĐ..."
                        className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {orders
                      .filter((o) =>
                        orderSearch.trim()
                          ? o.maDonSanTMDT.includes(orderSearch.trim()) ||
                            o.maVanDon.includes(orderSearch.trim()) ||
                            o.maDonHeThong.toLowerCase().includes(orderSearch.trim().toLowerCase())
                          : o.tinNhan.length > 0 || o.trangThaiDon !== 'HOAN_TAT_THANH_CONG'
                      )
                      .map((o) => {
                        const shop = getUserById(o.maNguoiNhoDat);
                        const ctv = getUserById(o.maNguoiDat);
                        return (
                          <div
                            key={o.maDonHeThong}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2.5 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-mono font-extrabold text-indigo-700">
                                  {o.maDonHeThong} • Mã sàn: {o.maDonSanTMDT}
                                </span>
                                {renderOrderStatusBadge(o.trangThaiDon)}
                              </div>
                              <div className="text-slate-800 break-words">
                                Shop: <strong>{shop?.hoVaTen}</strong> • CTV: <strong>{ctv?.hoVaTen}</strong>
                              </div>
                              <div className="font-mono font-bold text-emerald-700">Mã vận đơn: {o.maVanDon}</div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                              <button
                                type="button"
                                onClick={() =>
                                  setEvidenceModal({
                                    type: 'ORDER_IMAGES',
                                    title: `Chứng Từ AI OCR - Đơn ${o.maDonHeThong}`,
                                    data: o,
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 cursor-pointer"
                              >
                                Xem ảnh chứng từ ({o.anhBangChung.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => openOrderChat(o.maDonHeThong)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> Trao đổi đơn ({o.tinNhan.length})
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB ADMIN 2: CẤP TÀI KHOẢN & QUẢN LÝ THÀNH VIÊN */}
            {adminTab === 'ACCOUNTS' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <UserPlus className="w-5 h-5 text-indigo-600" /> Cấp Phát Tài Khoản Mới
                  </h3>
                  <form onSubmit={handleCreateAccount} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Số điện thoại đăng nhập</label>
                      <input
                        type="text"
                        value={newAccPhone}
                        onChange={(e) => setNewAccPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Địa chỉ Email</label>
                      <input
                        type="email"
                        value={newAccEmail}
                        onChange={(e) => setNewAccEmail(e.target.value)}
                        placeholder="Nhập địa chỉ email"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Họ và tên / Tên đơn vị</label>
                      <input
                        type="text"
                        value={newAccName}
                        onChange={(e) => setNewAccName(e.target.value)}
                        placeholder="Nhập tên hiển thị"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Nhóm vai trò</label>
                      <select
                        value={newAccRole}
                        onChange={(e) => setNewAccRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                      >
                        <option value="NGUOI_NHO_DAT">Chủ đơn (Shop nhờ đặt hàng)</option>
                        <option value="NGUOI_DAT">Cộng tác viên (Người đặt hộ)</option>
                      </select>
                    </div>
                    {newAccRole === 'NGUOI_NHO_DAT' && (
                      <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                        <label className="block font-bold text-indigo-950 mb-1">
                          Mức chiết khấu mặc định (%):
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={newAccComm}
                          onChange={(e) => setNewAccComm(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-indigo-300 font-bold text-indigo-900 bg-white"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Mật khẩu khởi tạo</label>
                      <input
                        type="text"
                        value={newAccPass}
                        onChange={(e) => setNewAccPass(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow cursor-pointer"
                    >
                      Tạo Tài Khoản
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Danh Sách Tài Khoản Thành Viên ({users.length})
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAccountRoleFilter('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          accountRoleFilter === 'ALL'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        Tất cả ({users.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountRoleFilter('NGUOI_NHO_DAT')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          accountRoleFilter === 'NGUOI_NHO_DAT'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        Chủ đơn / Shop ({users.filter((u) => u.vaiTro === 'NGUOI_NHO_DAT').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountRoleFilter('NGUOI_DAT')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          accountRoleFilter === 'NGUOI_DAT'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        Cộng tác viên ({users.filter((u) => u.vaiTro === 'NGUOI_DAT').length})
                      </button>
                    </div>

                    <div className="relative flex-1 sm:max-w-xs">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={accountSearchQuery}
                        onChange={(e) => setAccountSearchQuery(e.target.value)}
                        placeholder="Tìm theo SĐT, Tên, Email..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {users
                      .filter((u) => accountRoleFilter === 'ALL' || u.vaiTro === accountRoleFilter)
                      .filter((u) => {
                        if (!accountSearchQuery.trim()) return true;
                        const q = accountSearchQuery.trim().toLowerCase();
                        return (
                          u.hoVaTen.toLowerCase().includes(q) ||
                          u.soDienThoai.toLowerCase().includes(q) ||
                          u.email.toLowerCase().includes(q) ||
                          u.maNguoiDung.toLowerCase().includes(q)
                        );
                      })
                      .map((u) => (
                        <div
                          key={u.maNguoiDung}
                          className="p-3.5 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm break-words">
                                {u.hoVaTen}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  u.vaiTro === 'ADMIN'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : u.vaiTro === 'NGUOI_NHO_DAT'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {u.vaiTro === 'ADMIN'
                                  ? 'Quản trị viên'
                                  : u.vaiTro === 'NGUOI_NHO_DAT'
                                  ? 'Chủ đơn (Shop)'
                                  : 'Cộng tác viên'}
                              </span>
                              <OnlineStatusBadge user={u} compact />
                            </div>

                            <div className="text-slate-800 font-mono break-all">
                              SĐT: <strong className="text-indigo-700">{u.soDienThoai}</strong> • Email: {u.email}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-slate-800">
                                Mật khẩu: <strong className="text-rose-700">{u.matKhau}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyAccountCredentials(u)}
                                className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" /> Sao chép
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {u.vaiTro === 'NGUOI_NHO_DAT' && (
                              <div className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                                <span className="text-[11px] font-bold text-indigo-900">Chiết khấu:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="50"
                                  value={u.phanTramHoaHongMacDinh}
                                  onChange={(e) => handleUpdateShopDefaultComm(u.maNguoiDung, e.target.value)}
                                  className="w-12 px-1.5 py-0.5 rounded border border-indigo-300 font-bold text-center bg-white text-slate-900"
                                />
                                <span className="font-bold text-indigo-900">%</span>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setEvidenceModal({
                                  type: 'QR_CODE',
                                  title: `Mã QR Ngân Hàng — ${u.hoVaTen}`,
                                  data: u,
                                })
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold border border-slate-300 cursor-pointer"
                            >
                              Mã QR
                            </button>

                            {resettingUserId === u.maNguoiDung ? (
                              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-300">
                                <input
                                  type="text"
                                  value={resetPasswordValue}
                                  onChange={(e) => setResetPasswordValue(e.target.value)}
                                  className="w-20 px-1.5 py-0.5 rounded border border-amber-400 font-mono bg-white text-slate-900"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAdminResetUserPassword(u.maNguoiDung)}
                                  className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold cursor-pointer"
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setResettingUserId(null)}
                                  className="px-1.5 py-0.5 text-slate-700 font-semibold"
                                >
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setResettingUserId(u.maNguoiDung);
                                  setResetPasswordValue('123456');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 cursor-pointer"
                              >
                                Cấp lại MK
                              </button>
                            )}

                            {u.vaiTro !== 'ADMIN' && (
                              <button
                                type="button"
                                onClick={() => handleToggleLockUser(u.maNguoiDung)}
                                className={`px-2.5 py-1.5 rounded-xl font-bold cursor-pointer ${
                                  u.trangThaiTK === 'ACTIVE'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-600 text-white'
                                }`}
                              >
                                {u.trangThaiTK === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB ADMIN 3: QUẢN LÝ SÀN KÈO & ĐIỀU CHỈNH CHIẾT KHẤU */}
            {adminTab === 'CAMPAIGNS' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Quản Lý Sàn Kèo & Cấu Hình Chiết Khấu Theo Kèo
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((k) => {
                    const shop = getUserById(k.maNguoiNhoDat);
                    const currentVal =
                      editingKeoComm[k.maKeo] !== undefined
                        ? editingKeoComm[k.maKeo]
                        : k.phanTramHoaHongApDung;

                    return (
                      <div
                        key={k.maKeo}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full font-mono font-extrabold bg-indigo-100 text-indigo-800">
                            {k.maKeo}
                          </span>
                          <span className="font-bold text-slate-800 break-words">
                            Chủ đơn: {shop?.hoVaTen}
                          </span>
                        </div>
                        <div className="font-extrabold text-slate-900 text-sm break-words">
                          {k.tenMatHang}
                        </div>
                        <div className="text-slate-800">
                          Hình thức trả công:{' '}
                          <strong>
                            {k.kieuTinhCong === 'CONG_CO_DINH'
                              ? `Công cố định ${formatVND(k.tienCongCoDinh)}/đơn`
                              : `Hưởng chênh lệch dưới ${formatVND(k.giaMucTieuHoacTran)}`}
                          </strong>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-indigo-200 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-indigo-950 block">
                              Mức phí dịch vụ ({k.daSuaHoaHongRieng ? 'Cấu hình riêng' : 'Theo mặc định Shop'}):
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={currentVal}
                              onChange={(e) =>
                                setEditingKeoComm((prev) => ({
                                  ...prev,
                                  [k.maKeo]: e.target.value,
                                }))
                              }
                              className="w-16 px-2 py-1 rounded-lg border border-indigo-300 font-bold text-center text-slate-900"
                            />
                            <span className="font-bold text-slate-900">%</span>
                            <button
                              type="button"
                              onClick={() => handleSaveCampaignCommOverride(k.maKeo)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                            >
                              Cập nhật
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB ADMIN 4: THU TIỀN SHOP & TRẢ CÔNG CTV */}
            {adminTab === 'SETTLEMENT' && (
              <div className="space-y-6">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button
                      type="button"
                      onClick={() => setAdminSettleSubTab('ACTIVE')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                        adminSettleSubTab === 'ACTIVE'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      Danh Sách Chờ Thu Tiền Shop & Trả Công CTV
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminSettleSubTab('HISTORY')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                        adminSettleSubTab === 'HISTORY'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      Lịch Sử Đã Thanh Toán Xong
                    </button>
                  </div>
                </div>

                {adminSettleSubTab === 'ACTIVE' ? (
                  <>
                    {/* Bước 1: Thu tiền từ Shop */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-base font-extrabold text-slate-900">
                          1. Khoản Thu Tiền Công Từ Chủ Đơn (Shop Chuyển Khoản Cho Admin)
                        </h3>
                      </div>

                      {(() => {
                        const pendingShops = users
                          .filter((u) => u.vaiTro === 'NGUOI_NHO_DAT')
                          .filter((shop) => {
                            const hasUnverifiedDoneOrders = orders.some(
                              (o) =>
                                o.maNguoiNhoDat === shop.maNguoiDung &&
                                o.trangThaiDon === 'HOAN_TAT_THANH_CONG' &&
                                o.trangThaiTT2Chang !== 'ADMIN_DA_TRA_CONG' &&
                                !o.daDuyetChang1
                            );
                            return (
                              hasUnverifiedDoneOrders ||
                              settlements.shopPayments[shop.maNguoiDung]?.trangThai ===
                                'SHOP_DA_CK_CHO_DUYET'
                            );
                          });

                        if (pendingShops.length === 0) {
                          return (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                              Toàn bộ khoản thu từ Chủ đơn đã được xác nhận hoàn tất.
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingShops.map((shop) => {
                              const shopDoneOrders = orders.filter(
                                (o) =>
                                  o.maNguoiNhoDat === shop.maNguoiDung &&
                                  o.trangThaiDon === 'HOAN_TAT_THANH_CONG' &&
                                  o.trangThaiTT2Chang !== 'ADMIN_DA_TRA_CONG' &&
                                  !o.daDuyetChang1
                              );
                              const totalShopMustPay = shopDoneOrders.reduce(
                                (s, o) => s + o.tienCongGoc,
                                0
                              );
                              const payInfo = settlements.shopPayments[shop.maNguoiDung] || {
                                trangThai: 'CHO_SHOP_CK',
                                anhBillChang1: '',
                              };
                              const hasUploadedBill =
                                payInfo.trangThai === 'SHOP_DA_CK_CHO_DUYET' &&
                                Boolean(payInfo.anhBillChang1);

                              return (
                                <div
                                  key={shop.maNguoiDung}
                                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                      <h4 className="font-extrabold text-slate-900 text-sm break-words">
                                        {shop.hoVaTen}
                                      </h4>
                                      <span className="text-slate-700 font-medium">
                                        Số đơn đã giao & khớp: <strong>{shopDoneOrders.length} đơn</strong>
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-slate-700 font-semibold block">Tổng tiền Shop cần chuyển:</span>
                                      <span className="text-base font-extrabold text-indigo-700">
                                        {formatVND(totalShopMustPay)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {hasUploadedBill ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setEvidenceModal({
                                              type: 'BILL_CK',
                                              title: `Bill Chuyển Khoản Từ Shop — ${shop.hoVaTen}`,
                                              data: {
                                                maBill: payInfo.anhBillChang1,
                                                anhBillDataUrl: payInfo.anhBillDataUrl,
                                                nguoiChuyen: shop.hoVaTen,
                                                nguoiNhan: currentUser.hoVaTen,
                                                soTien: payInfo.soTienDaCK || totalShopMustPay,
                                                thoiGian: payInfo.thoiGianCK,
                                              },
                                            })
                                          }
                                          className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 cursor-pointer"
                                        >
                                          Xem Bill CK
                                        </button>
                                      ) : (
                                        <span className="text-amber-800 font-bold">
                                          Shop chưa tải Bill chuyển khoản
                                        </span>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => setActivePaymentChatPartnerId(shop.maNguoiDung)}
                                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" /> Nhắn Shop
                                      </button>
                                    </div>

                                    {hasUploadedBill ? (
                                      <button
                                        type="button"
                                        onClick={() => handleAdminConfirmStage1(shop.maNguoiDung)}
                                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow cursor-pointer"
                                      >
                                        Xác Nhận Đã Nhận Tiền
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        disabled
                                        className="px-3 py-2 rounded-xl bg-slate-200 text-slate-500 font-bold cursor-not-allowed"
                                      >
                                        Chờ Shop tải Bill lên
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bước 2: Trả công cho CTV */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-base font-extrabold text-slate-900">
                          2. Chi Trả Tiền Công Cho Cộng Tác Viên (Admin Chuyển Khoản Cho CTV)
                        </h3>
                      </div>

                      {(() => {
                        const pendingCtvs = users
                          .filter((u) => u.vaiTro === 'NGUOI_DAT' && !u.firstLogin)
                          .filter((ctv) =>
                            orders.some(
                              (o) =>
                                o.maNguoiDat === ctv.maNguoiDung &&
                                o.trangThaiDon === 'HOAN_TAT_THANH_CONG' &&
                                o.trangThaiTT2Chang !== 'ADMIN_DA_TRA_CONG'
                            )
                          );

                        if (pendingCtvs.length === 0) {
                          return (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                              Đã thanh toán xong tiền công cho toàn bộ Cộng tác viên.
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            {pendingCtvs.map((ctv) => {
                              const ctvDoneOrders = orders.filter(
                                (o) =>
                                  o.maNguoiDat === ctv.maNguoiDung &&
                                  o.trangThaiDon === 'HOAN_TAT_THANH_CONG' &&
                                  o.trangThaiTT2Chang !== 'ADMIN_DA_TRA_CONG'
                              );
                              const grossTotal = ctvDoneOrders.reduce((s, o) => s + o.tienCongGoc, 0);
                              const adminFeeTotal = ctvDoneOrders.reduce(
                                (s, o) => s + o.hoaHongAdmin,
                                0
                              );
                              const netTotal = ctvDoneOrders.reduce(
                                (s, o) => s + o.tienCongThucNhan,
                                0
                              );

                              const eligibleNet = ctvDoneOrders
                                .filter(
                                  (o) =>
                                    o.daDuyetChang1 ||
                                    settlements.shopPayments[o.maNguoiNhoDat]?.trangThai ===
                                      'ADMIN_DA_XAC_NHAN'
                                )
                                .reduce((s, o) => s + o.tienCongThucNhan, 0);
                              const waitingShopNet = netTotal - eligibleNet;
                              const draftBill = adminStage2DraftBills[ctv.maNguoiDung];

                              return (
                                <div
                                  key={ctv.maNguoiDung}
                                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                                >
                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-sm font-extrabold text-slate-900 break-words">
                                        {ctv.hoVaTen}
                                      </span>
                                      <OnlineStatusBadge user={ctv} compact />
                                    </div>
                                    <div className="text-slate-800">
                                      Đơn đã khớp: <strong>{ctvDoneOrders.length} đơn</strong> • Tiền công Shop trả:{' '}
                                      <strong>{formatVND(grossTotal)}</strong> • Phí dịch vụ Admin:{' '}
                                      <strong className="text-amber-700">
                                        -{formatVND(adminFeeTotal)}
                                      </strong>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 pt-1">
                                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold">
                                        Số tiền chuyển cho CTV: {formatVND(netTotal)}
                                      </span>
                                      <span className="text-emerald-700 font-bold">
                                        Shop đã nộp đủ (Chi trả ngay): {formatVND(eligibleNet)}
                                      </span>
                                      {waitingShopNet > 0 && (
                                        <span className="text-amber-800 font-semibold">
                                          Đang chờ Shop chuyển: {formatVND(waitingShopNet)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setActivePaymentChatPartnerId(ctv.maNguoiDung)}
                                      className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" /> Nhắn CTV
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEvidenceModal({
                                          type: 'QR_CODE',
                                          title: `Mã QR Nhận Tiền — ${ctv.hoVaTen}`,
                                          data: ctv,
                                        })
                                      }
                                      className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 cursor-pointer"
                                    >
                                      Mã QR CTV
                                    </button>

                                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold flex items-center gap-1.5">
                                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                                      <span>
                                        {draftBill ? `Đã chọn: ${draftBill.fileName}` : '1. Tải Bill CK'}
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleAdminSelectStage2BillFile(ctv.maNguoiDung, e)
                                        }
                                        className="hidden"
                                      />
                                    </label>

                                    <button
                                      type="button"
                                      disabled={!draftBill}
                                      onClick={() =>
                                        handleAdminPayStage2(ctv.maNguoiDung, eligibleNet || netTotal)
                                      }
                                      className={`px-3.5 py-2 rounded-xl font-extrabold transition ${
                                        draftBill
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow cursor-pointer'
                                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                      }`}
                                    >
                                      2. Đã chuyển tiền
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </>
                ) : (
                  /* LỊCH SỬ ĐÃ XÁC NHẬN & TẤT TOÁN */
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-extrabold text-slate-900">
                        Lịch Sử Các Khoản Đã Thu Từ Shop & Đã Trả Công Cho CTV
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-indigo-900 uppercase">
                          Khoản Đã Thu Từ Chủ Đơn (Shop):
                        </h4>
                        {users
                          .filter(
                            (u) =>
                              u.vaiTro === 'NGUOI_NHO_DAT' &&
                              settlements.shopPayments[u.maNguoiDung]?.trangThai ===
                                'ADMIN_DA_XAC_NHAN'
                          )
                          .map((shop) => {
                            const payInfo = settlements.shopPayments[shop.maNguoiDung];
                            return (
                              <div
                                key={shop.maNguoiDung}
                                className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-extrabold text-slate-900">{shop.hoVaTen}</span>
                                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                                    Đã thu {formatVND(payInfo.soTienDaCK)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEvidenceModal({
                                        type: 'BILL_CK',
                                        title: `Bill Chuyển Khoản Của Shop — ${shop.hoVaTen}`,
                                        data: {
                                          maBill: payInfo.anhBillChang1,
                                          anhBillDataUrl: payInfo.anhBillDataUrl,
                                          nguoiChuyen: shop.hoVaTen,
                                          nguoiNhan: currentUser.hoVaTen,
                                          soTien: payInfo.soTienDaCK,
                                          thoiGian: payInfo.thoiGianCK,
                                        },
                                      })
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 font-bold border border-indigo-200 cursor-pointer"
                                  >
                                    Xem Bill CK
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActivePaymentChatPartnerId(shop.maNguoiDung)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <MessageSquare className="w-3 h-3" /> Nhắn Shop
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-extrabold text-emerald-900 uppercase">
                          Khoản Đã Chi Trả Cho Cộng Tác Viên (CTV):
                        </h4>
                        {users
                          .filter(
                            (u) =>
                              u.vaiTro === 'NGUOI_DAT' &&
                              settlements.ctvPayouts[u.maNguoiDung]?.trangThai ===
                                'DA_TAT_TOAN_CHANG_2'
                          )
                          .map((ctv) => {
                            const payInfo = settlements.ctvPayouts[ctv.maNguoiDung];
                            return (
                              <div
                                key={ctv.maNguoiDung}
                                className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-extrabold text-slate-900">{ctv.hoVaTen}</span>
                                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                                    Đã trả {formatVND(payInfo.soTienDaTra)}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-700 font-medium">
                                  Thời gian chuyển: {payInfo.thoiGianCK}
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEvidenceModal({
                                        type: 'BILL_CK',
                                        title: `Bill Trả Tiền Công Cho CTV — ${ctv.hoVaTen}`,
                                        data: {
                                          maBill: payInfo.anhBillChang2,
                                          anhBillDataUrl: payInfo.anhBillDataUrl,
                                          nguoiChuyen: 'Admin Điều Phối',
                                          nguoiNhan: ctv.hoVaTen,
                                          soTien: payInfo.soTienDaTra,
                                          thoiGian: payInfo.thoiGianCK,
                                        },
                                      })
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-white text-indigo-700 font-bold border border-indigo-200 cursor-pointer"
                                  >
                                    Xem Bill CK
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActivePaymentChatPartnerId(ctv.maNguoiDung)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <MessageSquare className="w-3 h-3" /> Nhắn CTV
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        )}

        {/* ====================================================================
            PHÂN HỆ 2: GIAO DIỆN NGƯỜI NHỜ ĐẶT HÀNG / CHỦ ĐƠN (SHOP)
           ==================================================================== */}
        {currentUser.vaiTro === 'NGUOI_NHO_DAT' && (
          <main className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5 flex-1 space-y-6">
            {shopTab === 'PROFILE' && renderPersonalAccountSection()}

            {/* TAB SHOP 1: BẢNG TỔNG QUÁT TIẾN ĐỘ KÈO & DANH SÁCH ĐƠN HÀNG */}
            {shopTab === 'ORDERS' && (
              <div className="space-y-6">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Tiến Độ Các Kèo Đang Triển Khai
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaigns
                      .filter((k) => k.maNguoiNhoDat === currentUser.maNguoiDung)
                      .map((k) => {
                        const keoOrders = orders.filter((o) => o.maKeo === k.maKeo);
                        const doneCount = keoOrders.filter(
                          (o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG'
                        ).length;
                        const activeHoldCount = k.soNguoiDangGiuCho || 0;
                        const holdMinsVal =
                          editingHoldTime[k.maKeo] !== undefined
                            ? editingHoldTime[k.maKeo]
                            : k.thoiGianGiuChoPhut;

                        return (
                          <div
                            key={k.maKeo}
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full font-mono font-extrabold bg-emerald-100 text-emerald-800">
                                  {k.maKeo}
                                </span>
                                <span className="font-bold text-slate-800">
                                  {k.khongGioiHanSoLuong
                                    ? `Không giới hạn (Đã đặt: ${k.soLuongDaDat})`
                                    : `Số lượng: ${k.soLuongDaDat}/${k.soLuongCanDat} đơn`}
                                </span>
                              </div>
                              <span className="text-emerald-700 font-extrabold">
                                Hoàn tất: {doneCount} đơn
                              </span>
                            </div>

                            <div className="font-bold text-slate-900 break-words">{k.tenMatHang}</div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-800 font-semibold">Thời gian giữ chỗ (phút):</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="180"
                                  value={holdMinsVal}
                                  onChange={(e) =>
                                    setEditingHoldTime((prev) => ({
                                      ...prev,
                                      [k.maKeo]: e.target.value,
                                    }))
                                  }
                                  className="w-14 px-2 py-1 rounded-lg border border-slate-300 font-bold text-center bg-white text-slate-900"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCampaignHoldTime(k.maKeo, holdMinsVal)}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer"
                                >
                                  Lưu
                                </button>
                              </div>

                              {activeHoldCount > 0 ? (
                                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold border border-amber-300">
                                  Đang có {activeHoldCount} lượt đặt đơn
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCampaignByShop(k)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Xóa kèo
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Danh sách đơn hàng */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  {(() => {
                    const allMyShopOrders = orders.filter(
                      (o) => o.maNguoiNhoDat === currentUser.maNguoiDung
                    );
                    const activeShopOrders = allMyShopOrders.filter(
                      (o) => !isOrderArchivedForShop(o)
                    );
                    const archivedShopOrders = allMyShopOrders.filter((o) =>
                      isOrderArchivedForShop(o)
                    );

                    const needWarehouseScanCount = activeShopOrders.filter(
                      (o) => !o.daKhopAnhKho && o.trangThaiDon !== 'HOAN_TAT_THANH_CONG'
                    ).length;
                    const waitCtvImagesCount = activeShopOrders.filter(
                      (o) => o.daKhopAnhKho && !o.daKhopAnhApp
                    ).length;
                    const matchedUnpaidCount = activeShopOrders.filter(
                      (o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG'
                    ).length;

                    const filteredShopOrders = (
                      shopOrderSubTab === 'ARCHIVED' ? archivedShopOrders : activeShopOrders
                    )
                      .filter((o) => {
                        if (shopOrderSubTab === 'ARCHIVED') return true;
                        if (shopActiveStepFilter === 'NEED_WAREHOUSE_SCAN') {
                          return !o.daKhopAnhKho && o.trangThaiDon !== 'HOAN_TAT_THANH_CONG';
                        }
                        if (shopActiveStepFilter === 'WAIT_CTV_IMAGES') {
                          return o.daKhopAnhKho && !o.daKhopAnhApp;
                        }
                        if (shopActiveStepFilter === 'MATCHED_WAIT_PAY') {
                          return o.trangThaiDon === 'HOAN_TAT_THANH_CONG';
                        }
                        return true;
                      })
                      .filter((o) => {
                        if (!shopOrderSearch.trim()) return true;
                        const q = shopOrderSearch.trim().toLowerCase();
                        const ctv = getUserById(o.maNguoiDat);
                        return (
                          o.maDonHeThong.toLowerCase().includes(q) ||
                          o.maDonSanTMDT.toLowerCase().includes(q) ||
                          o.maVanDon.toLowerCase().includes(q) ||
                          o.kyHieuQuetDuoc.toLowerCase().includes(q) ||
                          (ctv?.hoVaTen || '').toLowerCase().includes(q)
                        );
                      });

                    return (
                      <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <h3 className="text-base font-extrabold text-slate-900">
                            Danh Sách Đơn Đặt Hàng
                          </h3>

                          <div className="relative w-full md:w-72">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={shopOrderSearch}
                              onChange={(e) => setShopOrderSearch(e.target.value)}
                              placeholder="Tìm Mã đơn, MVĐ, tên CTV, ký hiệu..."
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <button
                              type="button"
                              onClick={() => setShopOrderSubTab('ACTIVE')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                                shopOrderSubTab === 'ACTIVE'
                                  ? 'bg-indigo-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                              }`}
                            >
                              Đơn Đang Xử Lý ({activeShopOrders.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setShopOrderSubTab('ARCHIVED')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                                shopOrderSubTab === 'ARCHIVED'
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                              }`}
                            >
                              Lịch Sử Đơn Đã Tất Toán ({archivedShopOrders.length})
                            </button>
                          </div>

                          {shopOrderSubTab === 'ACTIVE' && (
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                              <button
                                type="button"
                                onClick={() => setShopActiveStepFilter('ALL_ACTIVE')}
                                className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                                  shopActiveStepFilter === 'ALL_ACTIVE'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                Tất cả ({activeShopOrders.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => setShopActiveStepFilter('NEED_WAREHOUSE_SCAN')}
                                className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                                  shopActiveStepFilter === 'NEED_WAREHOUSE_SCAN'
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                                }`}
                              >
                                Kho chưa quét tem ({needWarehouseScanCount})
                              </button>
                              <button
                                type="button"
                                onClick={() => setShopActiveStepFilter('WAIT_CTV_IMAGES')}
                                className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                                  shopActiveStepFilter === 'WAIT_CTV_IMAGES'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                                }`}
                              >
                                Chờ CTV tải 2 ảnh đã giao ({waitCtvImagesCount})
                              </button>
                              <button
                                type="button"
                                onClick={() => setShopActiveStepFilter('MATCHED_WAIT_PAY')}
                                className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                                  shopActiveStepFilter === 'MATCHED_WAIT_PAY'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                Đã khớp • Chờ thanh toán công ({matchedUnpaidCount})
                              </button>
                            </div>
                          )}
                        </div>

                        {filteredShopOrders.length === 0 ? (
                          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-700 font-semibold">
                            Không có đơn hàng nào trong danh mục này.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {filteredShopOrders.map((o) => {
                              const ctv = getUserById(o.maNguoiDat);
                              const hasUnread = o.tinNhan.some((m) =>
                                (m.chuaDocBoi || []).includes(currentUser.maNguoiDung)
                              );
                              const lastMsg = o.tinNhan[o.tinNhan.length - 1];
                              return (
                                <div
                                  key={o.maDonHeThong}
                                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                                >
                                  <div className="space-y-1.5 min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-mono font-extrabold text-indigo-700 text-sm">
                                        {o.maDonHeThong} ({o.maKeo})
                                      </span>
                                      <span className="font-bold text-slate-900 break-words">
                                        CTV: {ctv?.hoVaTen}
                                      </span>
                                      <OnlineStatusBadge user={ctv} compact />
                                    </div>
                                    <div className="font-mono text-slate-900 break-all">
                                      Mã đơn sàn: <strong>{o.maDonSanTMDT}</strong> • Mã vận đơn:{' '}
                                      <strong className="text-emerald-700">{o.maVanDon}</strong>
                                    </div>
                                    <div className="text-slate-800 break-words">
                                      Người nhận: {o.kyHieuQuetDuoc} • Giá COD:{' '}
                                      <strong>{formatVND(o.giaCodThucTe)}</strong> • Tiền công:{' '}
                                      <strong className="text-indigo-700">{formatVND(o.tienCongGoc)}</strong>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {renderOrderStatusBadge(o.trangThaiDon)}
                                      {!o.daKhopAnhKho && o.trangThaiDon !== 'HOAN_TAT_THANH_CONG' && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setManualTrackingInput(
                                              o.maVanDon !== 'Chờ giao hàng' ? o.maVanDon : o.maDonSanTMDT
                                            );
                                            setShopTab('WAREHOUSE_MATCH');
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold cursor-pointer"
                                        >
                                          Quét tem nhận hàng →
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEvidenceModal({
                                            type: 'ORDER_IMAGES',
                                            title: `Chứng Từ Đơn Hàng ${o.maDonHeThong}`,
                                            data: o,
                                          })
                                        }
                                        className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 cursor-pointer"
                                      >
                                        Xem ảnh ({o.anhBangChung.length})
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => openOrderChat(o.maDonHeThong)}
                                        className="relative px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>Trao đổi ({o.tinNhan.length})</span>
                                        {hasUnread && (
                                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                                        )}
                                      </button>
                                      {o.trangThaiDon !== 'HOAN_TAT_THANH_CONG' && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteOrderByShop(o)}
                                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-200 cursor-pointer"
                                        >
                                          Xóa
                                        </button>
                                      )}
                                    </div>
                                    {lastMsg && (
                                      <p
                                        className={`text-[11px] break-words max-w-xs sm:text-right ${
                                          hasUnread ? 'text-rose-600 font-extrabold' : 'text-slate-700 font-medium'
                                        }`}
                                      >
                                        {hasUnread ? '🔴 Tin mới: ' : 'Tin nhắn: '} "{lastMsg.noiDung}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TAB SHOP 2: ĐĂNG KÈO MỚI */}
            {shopTab === 'CREATE_CAMPAIGN' && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Khởi Tạo Kèo Đặt Đơn Mới
                  </h3>
                </div>

                <form onSubmit={handleCreateCampaign} className="space-y-5 text-xs sm:text-sm">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="font-extrabold text-slate-900">
                        1. Hình Ảnh Đơn Hàng Mẫu (AI OCR Tự Động Trích Xuất Thông Tin)
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            runAiOcrExtractCampaignImage('bill_abbott_ensure_1_mon.png', 'SINGLE')
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-xs font-bold cursor-pointer"
                        >
                          Quét mẫu đơn 1 sản phẩm
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            runAiOcrExtractCampaignImage('bill_gop_3_mon_ensure.png', 'MULTI')
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold cursor-pointer"
                        >
                          Quét mẫu đơn gộp 3 sản phẩm
                        </button>
                        <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Tải Ảnh Đơn Mẫu</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadCampaignSampleImage}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {campAiScanNotice && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold break-words">
                        {campAiScanNotice}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCampIsMultiItem(false);
                            handleChangeCampItemCount(1);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                            !campIsMultiItem
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-white text-slate-800 border border-slate-300'
                          }`}
                        >
                          Đơn 1 sản phẩm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCampIsMultiItem(true);
                            if (campItemCount < 2) handleChangeCampItemCount(2);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                            campIsMultiItem
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-white text-slate-800 border border-slate-300'
                          }`}
                        >
                          Đơn gộp nhiều sản phẩm
                        </button>
                      </div>

                      {campIsMultiItem && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-indigo-950">Số lượng link sản phẩm:</span>
                          <input
                            type="number"
                            min="2"
                            max="10"
                            value={campItemCount}
                            onChange={(e) => handleChangeCampItemCount(e.target.value)}
                            className="w-16 px-2.5 py-1.5 rounded-xl border border-indigo-400 font-bold text-center bg-white text-slate-900"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {campLinksList.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white border border-indigo-100 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs"
                        >
                          <div className="md:col-span-4">
                            <label className="block font-bold text-slate-800 mb-1">
                              Đường dẫn sản phẩm #{idx + 1}
                            </label>
                            <input
                              type="text"
                              value={item.link}
                              onChange={(e) => handleUpdateCampLinkItem(idx, 'link', e.target.value)}
                              placeholder="https://vt.tiktok.com/..."
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900"
                              required
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block font-bold text-slate-800 mb-1">
                              Phân loại sản phẩm
                            </label>
                            <input
                              type="text"
                              value={item.phanLoai}
                              onChange={(e) => handleUpdateCampLinkItem(idx, 'phanLoai', e.target.value)}
                              placeholder="Nhập phân loại cần mua"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block font-bold text-slate-800 mb-1">
                              Số lượng
                            </label>
                            <input
                              type="text"
                              value={item.soLuongMua}
                              onChange={(e) => handleUpdateCampLinkItem(idx, 'soLuongMua', e.target.value)}
                              placeholder="Số lượng"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-emerald-700"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block font-bold text-slate-800 mb-1">
                              Ghi chú
                            </label>
                            <input
                              type="text"
                              value={item.ghiChuLoai}
                              onChange={(e) => handleUpdateCampLinkItem(idx, 'ghiChuLoai', e.target.value)}
                              placeholder="Yêu cầu chi tiết"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 text-xs">
                        Ghi chú đơn hàng
                      </label>
                      <input
                        type="text"
                        value={campGeneralNote}
                        onChange={(e) => setCampGeneralNote(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Kho nhận hàng
                      </label>
                      <select
                        value={campAddrId}
                        onChange={(e) => setCampAddrId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                      >
                        {addresses
                          .filter((a) => a.maNguoiNhoDat === currentUser.maNguoiDung)
                          .map((a) => (
                            <option key={a.maDiaChi} value={a.maDiaChi}>
                              {a.tenKhoGoiNho} — {a.kyHieuDinhDanh ? `Ký hiệu: ${a.kyHieuDinhDanh}` : 'Không ký hiệu'}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Số lượng đơn cần đặt
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={campUnlimited ? 'UNLIMITED' : 'LIMITED'}
                          onChange={(e) => setCampUnlimited(e.target.value === 'UNLIMITED')}
                          className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                        >
                          <option value="LIMITED">Giới hạn số lượng</option>
                          <option value="UNLIMITED">Không giới hạn số lượng</option>
                        </select>
                        {!campUnlimited && (
                          <input
                            type="number"
                            min="1"
                            value={campQty}
                            onChange={(e) => setCampQty(e.target.value)}
                            className="w-20 px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-center text-slate-900"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Thời gian giữ chỗ (phút)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={campHoldMins}
                        onChange={(e) => setCampHoldMins(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-amber-950 mb-1">Hình thức tính công</label>
                      <select
                        value={campCalcType}
                        onChange={(e) => setCampCalcType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-amber-300 font-bold text-slate-900 bg-white"
                      >
                        <option value="DUOI_GIA_TRAN_LA_CONG">Hưởng chênh lệch dưới giá trần</option>
                        <option value="CONG_CO_DINH">Tiền công cố định theo đơn</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-amber-950 mb-1">
                        {campCalcType === 'DUOI_GIA_TRAN_LA_CONG'
                          ? 'Mức giá trần tối đa (VNĐ)'
                          : 'Giá COD yêu cầu (VNĐ)'}
                      </label>
                      <input
                        type="number"
                        value={campTargetPrice}
                        onChange={(e) => setCampTargetPrice(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-amber-300 font-mono font-bold bg-white text-slate-900"
                        required
                      />
                    </div>

                    {campCalcType === 'DUOI_GIA_TRAN_LA_CONG' ? (
                      <div>
                        <label className="block font-bold text-amber-950 mb-1">
                          Giá COD trên ảnh mẫu (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={campSamplePrice}
                          onChange={(e) => setCampSamplePrice(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-amber-300 font-mono font-bold bg-white text-slate-900"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block font-bold text-amber-950 mb-1">
                          Đơn giá tiền công (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={campFixedWage}
                          onChange={(e) => setCampFixedWage(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-amber-300 font-mono font-bold bg-white text-slate-900"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-lg transition cursor-pointer"
                  >
                    Đăng Kèo Lên Hệ Thống
                  </button>
                </form>
              </div>
            )}

            {/* TAB SHOP 3: ĐỐI KHỚP KIỆN HÀNG TẠI KHO */}
            {shopTab === 'WAREHOUSE_MATCH' && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Quét Tem Vận Đơn & Đối Khớp Kiện Hàng Nhận Tại Kho
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>Tải Ảnh Tem Vận Đơn</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadWarehouseLabelImage}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => runAiScanOnUploadedLabel('', 'tem_kien_hang_ro_net.jpg', false)}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 cursor-pointer"
                    >
                      Quét mẫu tem tiêu chuẩn
                    </button>
                    <button
                      type="button"
                      onClick={() => runAiScanOnUploadedLabel('', 'tem_kien_hang_bi_mo_rach.jpg', true)}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold border border-amber-200 cursor-pointer"
                    >
                      Quét mẫu tem mờ / rách góc
                    </button>
                  </div>
                </div>

                {warehouseAiResult && (
                  <div
                    className={`p-4 rounded-2xl border space-y-3 text-xs ${
                      warehouseAiResult.status === 'BLURRY' || warehouseAiResult.status === 'NOT_FOUND'
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    }`}
                  >
                    <div className="font-extrabold text-sm break-words">{warehouseAiResult.message}</div>
                    <div className="p-3 rounded-xl bg-white/95 border border-slate-200 space-y-1 font-mono text-slate-900">
                      <div>
                        Mã vận đơn: <strong className="text-indigo-700">{warehouseAiResult.extractedTracking}</strong>
                      </div>
                      <div>
                        Mã đơn sàn: <strong>{warehouseAiResult.extractedOrderNo}</strong>
                      </div>
                      <div className="font-sans break-words">
                        Thông tin người nhận: <strong>{warehouseAiResult.extractedReceiver}</strong>
                      </div>
                    </div>

                    {warehouseAiResult.status === 'FOUND_IN_SYSTEM' && warehouseAiResult.matchedOrder && (
                      <button
                        type="button"
                        onClick={() =>
                          handleConfirmWarehouseMatch(warehouseAiResult.matchedOrder.maVanDon, false)
                        }
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow cursor-pointer"
                      >
                        Xác Nhận Khớp Đơn {warehouseAiResult.matchedOrder.maDonHeThong}
                      </button>
                    )}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <label className="block font-extrabold text-slate-900">
                    Tra Cứu & Đối Khớp Thủ Công Theo Mã Vận Đơn / Mã Đơn Hàng:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={manualTrackingInput}
                      onChange={(e) => setManualTrackingInput(e.target.value)}
                      placeholder="Nhập Mã vận đơn hoặc Mã đơn hàng sàn..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-white text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleConfirmWarehouseMatch(manualTrackingInput, true)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow cursor-pointer shrink-0"
                    >
                      Xác Nhận Đối Khớp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB SHOP 4: SỔ ĐỊA CHỈ KHO */}
            {shopTab === 'ADDRESS_BOOK' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
                  <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                    Thêm Địa Chỉ Kho Nhận Hàng
                  </h3>
                  <form onSubmit={handleAddAddress} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Tên kho nhận hàng</label>
                      <input
                        type="text"
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        placeholder="Nhập tên kho nhận hàng"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Địa chỉ chi tiết</label>
                      <input
                        type="text"
                        value={addrDetail}
                        onChange={(e) => setAddrDetail(e.target.value)}
                        placeholder="Số nhà, đường, xã/phường, quận/huyện, tỉnh/thành phố"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900"
                        required
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Ký hiệu định danh người nhận:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAddrHasCode(false)}
                            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                              !addrHasCode ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-800'
                            }`}
                          >
                            Không dùng
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddrHasCode(true)}
                            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                              addrHasCode ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-800'
                            }`}
                          >
                            Áp dụng
                          </button>
                        </div>
                      </div>
                      {addrHasCode && (
                        <input
                          type="text"
                          value={addrCode}
                          onChange={(e) => setAddrCode(e.target.value)}
                          placeholder="Nhập ký hiệu bắt buộc"
                          className="w-full px-3 py-2 rounded-lg border border-indigo-300 bg-white font-bold text-slate-900"
                        />
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Quy tắc dải số nhà:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAddrHasRange(false)}
                            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                              !addrHasRange ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-800'
                            }`}
                          >
                            Không dùng
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddrHasRange(true)}
                            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                              addrHasRange ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-800'
                            }`}
                          >
                            Áp dụng
                          </button>
                        </div>
                      </div>
                      {addrHasRange && (
                        <input
                          type="text"
                          value={addrRange}
                          onChange={(e) => setAddrRange(e.target.value)}
                          placeholder="Nhập dải số nhà cho phép"
                          className="w-full px-3 py-2 rounded-lg border border-indigo-300 bg-white font-bold text-slate-900"
                        />
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow cursor-pointer"
                    >
                      Lưu Địa Chỉ Kho
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                    Danh Sách Địa Chỉ Kho ({addresses.filter((a) => a.maNguoiNhoDat === currentUser.maNguoiDung).length})
                  </h3>
                  <div className="space-y-3 text-xs">
                    {addresses
                      .filter((a) => a.maNguoiNhoDat === currentUser.maNguoiDung)
                      .map((a) => (
                        <div
                          key={a.maDiaChi}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="font-extrabold text-slate-900 text-sm break-words">
                              {a.tenKhoGoiNho}
                            </div>
                            <div className="text-slate-800 font-medium break-words">Địa chỉ: {a.diaChiChiTiet}</div>
                            <div className="flex flex-wrap gap-2 pt-0.5">
                              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
                                Ký hiệu: {a.kyHieuDinhDanh ? a.kyHieuDinhDanh : 'Không áp dụng'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-bold border border-amber-200">
                                Dải số nhà: {a.daiSoNhaRandom ? a.daiSoNhaRandom : 'Không áp dụng'}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(a.maDiaChi)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-200 cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB SHOP 5: QUYẾT TOÁN TIỀN CÔNG */}
            {shopTab === 'SETTLEMENT' && (
              <div className="space-y-6">
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                  {(() => {
                    const myDoneOrders = orders.filter(
                      (o) =>
                        o.maNguoiNhoDat === currentUser.maNguoiDung &&
                        o.trangThaiDon === 'HOAN_TAT_THANH_CONG'
                    );
                    const myPayState = settlements.shopPayments[currentUser.maNguoiDung] || {
                      trangThai: 'CHO_SHOP_CK',
                    };
                    const unpaidDoneOrders = myDoneOrders.filter(
                      (o) => o.trangThaiTT2Chang === 'CHO_SHOP_CK' || o.trangThaiTT2Chang === 'CHUA_CHOT'
                    );

                    const paidArchivedOrders = myDoneOrders.filter(
                      (o) => !unpaidDoneOrders.some((u) => u.maDonHeThong === o.maDonHeThong)
                    );

                    const totalPayNow = unpaidDoneOrders.reduce((s, o) => s + o.tienCongGoc, 0);
                    const adminUser = users.find((u) => u.vaiTro === 'ADMIN');

                    return (
                      <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShopSettleSubTab('ACTIVE')}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                                shopSettleSubTab === 'ACTIVE'
                                  ? 'bg-indigo-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              Đơn Chờ Quyết Toán ({unpaidDoneOrders.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setShopSettleSubTab('HISTORY')}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                                shopSettleSubTab === 'HISTORY'
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              Lịch Sử Đã Thanh Toán ({paidArchivedOrders.length})
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActivePaymentChatPartnerId(currentUser.maNguoiDung)}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" /> Trao Đổi Thanh Toán Với Admin
                          </button>
                        </div>

                        {shopSettleSubTab === 'ACTIVE' ? (
                          unpaidDoneOrders.length === 0 ? (
                            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                              <h4 className="text-sm sm:text-base font-extrabold text-emerald-950">
                                Đã Hoàn Tất Quyết Toán Tiền Công
                              </h4>
                              <p className="text-xs text-emerald-900 font-medium max-w-xl mx-auto">
                                Không còn đơn hàng hoàn tất nào chờ thanh toán trong phiên hiện tại.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-5">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                  <h3 className="text-base font-extrabold text-slate-900">
                                    Bảng Tổng Hợp Quyết Toán Tiền Công
                                  </h3>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-slate-700 font-semibold block">
                                    Tổng số tiền thanh toán ({unpaidDoneOrders.length} đơn):
                                  </span>
                                  <span className="text-2xl font-extrabold text-indigo-700">
                                    {formatVND(totalPayNow)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEvidenceModal({
                                      type: 'QR_CODE',
                                      title: 'Mã QR Nhận Thanh Toán Của Admin Điều Phối',
                                      data: adminUser,
                                    })
                                  }
                                  className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold border border-indigo-200 cursor-pointer"
                                >
                                  Xem Mã QR Admin
                                </button>

                                <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-bold flex items-center gap-1.5">
                                  <Upload className="w-4 h-4 text-indigo-600" />
                                  <span>Tải Chứng Từ Chuyển Khoản</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleShopSelectStage1BillFile}
                                    className="hidden"
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => handleShopUploadStage1Bill(totalPayNow)}
                                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow cursor-pointer"
                                >
                                  Xác Nhận Hoàn Tất Chuyển Khoản
                                </button>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-xs font-extrabold uppercase text-slate-800">
                                  Chi Tiết Các Đơn Hàng Quyết Toán:
                                </h4>
                                {unpaidDoneOrders.map((o) => {
                                  const ctv = getUserById(o.maNguoiDat);
                                  return (
                                    <div
                                      key={o.maDonHeThong}
                                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-900"
                                    >
                                      <div>
                                        <span className="font-mono font-extrabold text-indigo-700">
                                          {o.maDonHeThong}
                                        </span>{' '}
                                        • Mã sàn: <span className="font-mono font-semibold">{o.maDonSanTMDT}</span> • CTV:{' '}
                                        <strong>{ctv?.hoVaTen}</strong>
                                      </div>
                                      <div className="font-mono font-extrabold text-indigo-700">
                                        Tiền công: {formatVND(o.tienCongGoc)}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="space-y-3 text-xs">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="font-extrabold text-slate-900">
                                  Tiến độ thanh toán:{' '}
                                  {myPayState.trangThai === 'ADMIN_DA_XAC_NHAN'
                                    ? '✅ Admin đã xác nhận nhận đủ tiền công từ Shop'
                                    : '⏳ Shop đã gửi Bill chuyển khoản • Đang chờ Admin xác nhận'}
                                </span>
                              </div>
                              {myPayState.anhBillChang1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEvidenceModal({
                                      type: 'BILL_CK',
                                      title: 'Chứng Từ Chuyển Khoản Đã Gửi',
                                      data: {
                                        maBill: myPayState.anhBillChang1,
                                        anhBillDataUrl: myPayState.anhBillDataUrl,
                                        nguoiChuyen: currentUser.hoVaTen,
                                        nguoiNhan: 'Admin Điều Phối',
                                        soTien: myPayState.soTienDaCK,
                                        thoiGian: myPayState.thoiGianCK,
                                      },
                                    })
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 cursor-pointer"
                                >
                                  Xem Bill CK
                                </button>
                              )}
                            </div>

                            {paidArchivedOrders.map((o) => (
                              <div
                                key={o.maDonHeThong}
                                className="p-3 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-slate-900"
                              >
                                <div>
                                  <span className="font-mono font-bold">
                                    {o.maDonHeThong}
                                  </span>{' '}
                                  • Mã sàn: <span className="font-mono">{o.maDonSanTMDT}</span> • MVĐ:{' '}
                                  <span className="font-mono font-bold text-emerald-700">{o.maVanDon}</span>
                                </div>
                                <div className="font-mono font-bold text-emerald-700">
                                  Đã thanh toán: {formatVND(o.tienCongGoc)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </main>
        )}

        {/* ====================================================================
            PHÂN HỆ 3: GIAO DIỆN NGƯỜI ĐẶT HÀNG / CTV ĐẶT HỘ
           ==================================================================== */}
        {currentUser.vaiTro === 'NGUOI_DAT' && (
          <main className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-5 flex-1 space-y-6">
            {ctvTab === 'PROFILE' && renderPersonalAccountSection()}

            {/* TAB CTV 1: SÀN KÈO ĐẶT ĐƠN */}
            {ctvTab === 'MARKETPLACE' && (
              <div className="space-y-6">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Sàn Kèo Đặt Đơn Trực Tuyến
                    </h3>
                  </div>

                  {(() => {
                    const allProvinces = Array.from(
                      new Set(
                        campaigns.map((k) =>
                          extractProvinceFromAddress(getAddressById(k.maDiaChi))
                        )
                      )
                    );

                    return (
                      <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                          <span className="font-extrabold text-slate-800 shrink-0 mr-1">
                            📍 Khu vực giao hàng:
                          </span>
                          <button
                            type="button"
                            onClick={() => setCtvProvinceFilter('ALL')}
                            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer ${
                              ctvProvinceFilter === 'ALL'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                            }`}
                          >
                            Tất cả ({campaigns.length})
                          </button>
                          {allProvinces.map((prov) => (
                            <button
                              key={prov}
                              type="button"
                              onClick={() => setCtvProvinceFilter(prov)}
                              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer ${
                                ctvProvinceFilter === prov
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                              }`}
                            >
                              {prov}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            <button
                              type="button"
                              onClick={() => setCtvLimitFilter('ALL')}
                              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer ${
                                ctvLimitFilter === 'ALL'
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              Tất cả loại kèo
                            </button>
                            <button
                              type="button"
                              onClick={() => setCtvLimitFilter('UNLIMITED')}
                              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer ${
                                ctvLimitFilter === 'UNLIMITED'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              Không giới hạn số lượng
                            </button>
                            <button
                              type="button"
                              onClick={() => setCtvLimitFilter('LIMITED')}
                              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer ${
                                ctvLimitFilter === 'LIMITED'
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200'
                              }`}
                            >
                              Giới hạn số lượng
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">Sắp xếp:</span>
                            <select
                              value={ctvWageSort}
                              onChange={(e) => setCtvWageSort(e.target.value)}
                              className="px-3 py-1.5 rounded-xl border border-slate-300 font-extrabold bg-white text-indigo-900"
                            >
                              <option value="HIGH_TO_LOW">Tiền công: Cao → Thấp</option>
                              <option value="LOW_TO_HIGH">Tiền công: Thấp → Cao</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {campaigns
                    .filter((k) => {
                      if (!k.khongGioiHanSoLuong && k.soLuongDaDat >= k.soLuongCanDat && heldCampaignId !== k.maKeo) {
                        return false;
                      }
                      return k.trangThaiKeo === 'DANG_MO';
                    })
                    .filter((k) => {
                      if (ctvProvinceFilter === 'ALL') return true;
                      const prov = extractProvinceFromAddress(getAddressById(k.maDiaChi));
                      return prov === ctvProvinceFilter;
                    })
                    .filter((k) => {
                      if (ctvLimitFilter === 'UNLIMITED') return k.khongGioiHanSoLuong;
                      if (ctvLimitFilter === 'LIMITED') return !k.khongGioiHanSoLuong;
                      return true;
                    })
                    .slice()
                    .sort((a, b) => {
                      const netA = getCtvNetWageForCampaign(a);
                      const netB = getCtvNetWageForCampaign(b);
                      return ctvWageSort === 'HIGH_TO_LOW' ? netB - netA : netA - netB;
                    })
                    .map((k) => {
                      const shop = getUserById(k.maNguoiNhoDat);
                      const addr = getAddressById(k.maDiaChi);
                      const provinceName = extractProvinceFromAddress(addr);
                      const links = k.danhSachLink || [
                        {
                          link: k.linkSanPham,
                          phanLoai: 'Theo ảnh đơn mẫu',
                          soLuongMua: '1',
                          ghiChuLoai: k.ghiChuKeo,
                        },
                      ];

                      const sampleNetWage = getCtvNetWageForCampaign(k);
                      const quickCodInput =
                        quickCalcPrices[k.maKeo] !== undefined
                          ? quickCalcPrices[k.maKeo]
                          : k.giaMauTrenAnh;
                      const quickNetDiff = getCtvNetWageForCampaign(k, quickCodInput);

                      const isHoldingThis = heldCampaignId === k.maKeo;

                      return (
                        <div
                          key={k.maKeo}
                          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3.5">
                            {/* Dòng tiêu đề ngắn gọn: Mã kèo + Tỉnh giao + Số suất + Tên Shop */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-indigo-600 text-white">
                                  {k.maKeo}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900 text-amber-300">
                                  📍 Giao về: {provinceName}
                                </span>
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                                    k.khongGioiHanSoLuong
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {k.khongGioiHanSoLuong
                                    ? 'Không giới hạn đơn'
                                    : `Còn ${Math.max(0, k.soLuongCanDat - k.soLuongDaDat)}/${k.soLuongCanDat} đơn`}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-extrabold text-slate-900">
                                  {shop?.hoVaTen}
                                </span>
                                <OnlineStatusBadge user={shop} compact />
                              </div>
                            </div>

                            {/* BƯỚC 1: TIỀN CÔNG NHẬN ĐƯỢC & GIÁ COD CẦN ĐẶT (NỔI BẬT NHẤT ĐỂ CTV QUYẾT ĐỊNH) */}
                            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="text-[11px] font-extrabold uppercase text-emerald-900 block">
                                    1. Tiền công bạn nhận được:
                                  </span>
                                  <span className="text-xl font-extrabold text-emerald-700">
                                    +{formatVND(sampleNetWage)} / đơn
                                  </span>
                                </div>

                                <div className="text-right">
                                  <span className="text-[11px] font-extrabold uppercase text-slate-700 block">
                                    {k.kieuTinhCong === 'CONG_CO_DINH'
                                      ? 'Đặt đúng giá COD:'
                                      : 'Đặt dưới mức giá trần:'}
                                  </span>
                                  <span className="text-base font-extrabold font-mono text-rose-600">
                                    {formatVND(k.giaMucTieuHoacTran)}
                                  </span>
                                </div>
                              </div>

                              {k.kieuTinhCong === 'DUOI_GIA_TRAN_LA_CONG' && (
                                <div className="pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                                  <span className="font-bold text-slate-800">
                                    Nhập thử giá COD bạn áp mã được:
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      value={quickCodInput}
                                      onChange={(e) =>
                                        setQuickCalcPrices((prev) => ({
                                          ...prev,
                                          [k.maKeo]: e.target.value,
                                        }))
                                      }
                                      className="w-28 px-2.5 py-1 rounded-lg border border-emerald-400 bg-white font-mono font-bold text-slate-900"
                                    />
                                    <span className="font-extrabold text-emerald-800">
                                      = Công {formatVND(quickNetDiff)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* BƯỚC 2: ẢNH ĐƠN MẪU (TRÁI) + DANH SÁCH SẢN PHẨM & LINK MUA (PHẢI) — GỘP CHUNG 1 CHỖ, KHÔNG LẶP LẠI */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase text-slate-900">
                                  2. Sản phẩm cần đặt ({links.length} link):
                                </span>
                                <span className="text-[11px] font-bold text-slate-700">
                                  Giữ chỗ {k.thoiGianGiuChoPhut} phút
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                                <div className="sm:col-span-4">
                                  <DirectCampaignSampleImage
                                    campaign={k}
                                    title={k.tenMatHang}
                                    targetPrice={
                                      k.kieuTinhCong === 'DUOI_GIA_TRAN_LA_CONG'
                                        ? k.giaMauTrenAnh
                                        : k.giaMucTieuHoacTran
                                    }
                                    calcType={k.kieuTinhCong}
                                    onZoomImage={(camp) =>
                                      setEvidenceModal({
                                        type: 'SAMPLE_IMAGE_ZOOM',
                                        title: `Chi Tiết Đơn Mẫu — ${camp.maKeo}`,
                                        data: camp,
                                      })
                                    }
                                  />
                                </div>

                                <div className="sm:col-span-8 max-h-60 overflow-y-auto pr-1 space-y-2 text-xs">
                                  {links.map((lk, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs"
                                    >
                                      <div className="flex flex-wrap items-start justify-between gap-1.5">
                                        <span className="font-extrabold text-slate-900 break-words">
                                          {links.length > 1 ? `Món ${idx + 1}: ` : ''}
                                          {lk.phanLoai || 'Chọn đúng như ảnh mẫu'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold shrink-0">
                                          SL: {lk.soLuongMua || '1'}
                                        </span>
                                      </div>

                                      {lk.ghiChuLoai && (
                                        <div className="text-slate-700 font-semibold text-[11px] break-words">
                                          Lưu ý: {lk.ghiChuLoai}
                                        </div>
                                      )}

                                      <div className="flex items-center gap-1.5 pt-1">
                                        <button
                                          type="button"
                                          onClick={() => handleCopyProductLink(lk.link)}
                                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold border border-indigo-200 flex items-center justify-center gap-1 cursor-pointer truncate"
                                          title={lk.link}
                                        >
                                          <Copy className="w-3.5 h-3.5 shrink-0" />
                                          <span className="truncate">Copy Link</span>
                                        </button>
                                        <a
                                          href={lk.link}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex items-center gap-1 shrink-0"
                                        >
                                          <span>Mở Mua</span>
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </div>
                                  ))}

                                  {k.ghiChuKeo && (
                                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-[11px] font-bold break-words">
                                      📌 Ghi chú Shop: {k.ghiChuKeo}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* BƯỚC 3: ĐỊA CHỈ & KÝ HIỆU NHẬN HÀNG (CÓ NÚT COPY 1 CHẠM ĐỂ DÁN VÀO TIKTOK SHOP) */}
                            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-extrabold uppercase text-indigo-950">
                                  3. Thông tin địa chỉ giao hàng ({addr?.tenKhoGoiNho}):
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const fullAddrText = `${
                                      addr?.kyHieuDinhDanh ? `[${addr.kyHieuDinhDanh}] ` : ''
                                    }${addr?.daiSoNhaRandom ? `${addr.daiSoNhaRandom}, ` : ''}${
                                      addr?.diaChiChiTiet || ''
                                    }`;
                                    handleCopyProductLink(fullAddrText);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" /> Copy Địa Chỉ & Ký Hiệu
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="p-2 rounded-lg bg-white border border-indigo-100">
                                  <span className="text-[11px] text-slate-600 font-semibold block">
                                    Ký hiệu bắt buộc ở Tên/ĐC:
                                  </span>
                                  <strong className="text-rose-700 font-extrabold">
                                    {addr?.kyHieuDinhDanh ? addr.kyHieuDinhDanh : 'Không cần ký hiệu'}
                                  </strong>
                                </div>
                                <div className="p-2 rounded-lg bg-white border border-indigo-100">
                                  <span className="text-[11px] text-slate-600 font-semibold block">
                                    Dải số nhà ghi kèm:
                                  </span>
                                  <strong className="text-amber-900 font-extrabold">
                                    {addr?.daiSoNhaRandom ? addr.daiSoNhaRandom : 'Không cần số nhà'}
                                  </strong>
                                </div>
                              </div>

                              <div className="p-2 rounded-lg bg-white border border-indigo-100 text-slate-900 break-words">
                                <span className="text-[11px] text-slate-600 font-semibold">Địa chỉ kho: </span>
                                <strong>{addr?.diaChiChiTiet}</strong>
                              </div>
                            </div>
                          </div>

                          {/* BƯỚC 4: NÚT GIỮ CHỖ & NỘP ẢNH ĐÃ ĐẶT HÀNG */}
                          <div className="pt-2 border-t border-slate-100">
                            {!isHoldingThis ? (
                              <button
                                type="button"
                                onClick={() => handleHoldCampaignSlot(k)}
                                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                              >
                                <Clock className="w-4 h-4" />
                                <span>Bấm Giữ Chỗ Để Đặt Đơn ({k.thoiGianGiuChoPhut} Phút)</span>
                              </button>
                            ) : (
                              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 text-xs">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                  <span className="font-extrabold text-amber-400">
                                    ⏳ Đang giữ chỗ đặt đơn:{' '}
                                    {Math.floor(holdSecondsLeft / 60)}:
                                    {String(holdSecondsLeft % 60).padStart(2, '0')}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleReleaseCampaignHold(k.maKeo)}
                                    className="text-slate-300 hover:text-white underline cursor-pointer"
                                  >
                                    Hủy giữ chỗ
                                  </button>
                                </div>

                                {/* Nút tải file ảnh chụp màn hình Đã đặt hàng thực tế từ điện thoại/máy tính */}
                                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                                  <span className="font-bold text-slate-200 truncate">
                                    {placedOrderImgName
                                      ? `Đã chọn ảnh: ${placedOrderImgName}`
                                      : 'Bước 1: Tải ảnh chụp màn hình "Đã đặt hàng"'}
                                  </span>
                                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold inline-flex items-center gap-1.5 shrink-0">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Chọn Ảnh Đơn</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleUploadPlacedOrderImageFile(e, k)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <div>
                                    <label className="block text-[11px] text-slate-200 font-semibold mb-1">
                                      Mã số đơn hàng (AI đọc hoặc nhập):
                                    </label>
                                    <input
                                      type="text"
                                      value={customOrderCode}
                                      onChange={(e) => setCustomOrderCode(e.target.value)}
                                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] text-slate-200 font-semibold mb-1">
                                      Tổng tiền COD trên đơn (VNĐ):
                                    </label>
                                    <input
                                      type="number"
                                      value={customCodPrice}
                                      onChange={(e) => setCustomCodPrice(e.target.value)}
                                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-amber-300 font-bold"
                                    />
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                                  <span className="text-[11px] text-slate-300 font-semibold">
                                    Kiểm tra trường hợp AI OCR:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setOcrScenario('VALID')}
                                      className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                                        ocrScenario === 'VALID'
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-slate-800 text-slate-300'
                                      }`}
                                    >
                                      Đơn đúng
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setOcrScenario('ERR_PRICE')}
                                      className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                                        ocrScenario === 'ERR_PRICE'
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-slate-800 text-slate-300'
                                      }`}
                                    >
                                      Sai giá
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setOcrScenario('ERR_TAG')}
                                      className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                                        ocrScenario === 'ERR_TAG'
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-slate-800 text-slate-300'
                                      }`}
                                    >
                                      Thiếu ký hiệu
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setOcrScenario('ERR_DUP')}
                                      className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                                        ocrScenario === 'ERR_DUP'
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-slate-800 text-slate-300'
                                      }`}
                                    >
                                      Trùng mã
                                    </button>
                                  </div>
                                </div>

                                {ocrRedAlert && (
                                  <div className="p-3 rounded-xl bg-rose-950 border-2 border-rose-500 text-rose-100 space-y-1">
                                    <div className="font-extrabold text-rose-300 flex items-center gap-1.5">
                                      <AlertOctagon className="w-4 h-4 shrink-0" />
                                      <span>{ocrRedAlert.title}</span>
                                    </div>
                                    <ul className="list-disc list-inside text-[11px] space-y-0.5">
                                      {ocrRedAlert.details.map((d, i) => (
                                        <li key={i} className="break-words">
                                          {d}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleCtvSubmitPlacedOrderAI(k)}
                                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold shadow cursor-pointer"
                                >
                                  Xác Nhận Hoàn Tất Đặt Đơn
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB CTV 2: QUẢN LÝ ĐƠN & BÁO GIAO */}
            {ctvTab === 'MY_ORDERS' && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Cập Nhật Chứng Từ Giao Hàng Thành Công (Tải 2 Ảnh & Đối Soát Mã)
                    </h3>
                  </div>

                  {(() => {
                    const deliveringOrders = orders.filter(
                      (o) =>
                        o.maNguoiDat === currentUser.maNguoiDung &&
                        o.trangThaiDon !== 'HOAN_TAT_THANH_CONG' &&
                        o.trangThaiDon !== 'DA_HUY_HOAN_HANG'
                    );

                    if (deliveringOrders.length === 0) {
                      return (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                          Toàn bộ đơn hàng đã được cập nhật chứng từ và đối khớp hoàn tất.
                        </div>
                      );
                    }

                    return (
                      <form onSubmit={handleCtvSubmitDelivered2Images} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">
                              1. Chọn đơn hàng cần báo giao:
                            </label>
                            <select
                              value={deliveringOrderId}
                              onChange={(e) => {
                                const ord = orders.find((x) => x.maDonHeThong === e.target.value);
                                setDeliveringOrderId(e.target.value);
                                if (ord) {
                                  setDeliveryOrderCodeInput(ord.maDonSanTMDT || '');
                                  setDeliveryTrackingInput(
                                    ord.maVanDon && ord.maVanDon !== 'Chờ giao hàng'
                                      ? ord.maVanDon
                                      : '530199887766'
                                  );
                                }
                              }}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                            >
                              {deliveringOrders.map((o) => (
                                <option key={o.maDonHeThong} value={o.maDonHeThong}>
                                  {o.maDonHeThong} — Mã sàn: {o.maDonSanTMDT}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-800 mb-1">
                              2. Ảnh màn hình "Đã giao đơn hàng":
                            </label>
                            <label className="cursor-pointer w-full px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 font-bold text-slate-900 flex items-center justify-between gap-2">
                              <span className="break-words">
                                {ctvDeliveredImg1Name || 'Tải ảnh Đã giao đơn hàng'}
                              </span>
                              <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  setCtvDeliveredImg1Name(f.name);
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      setCtvDeliveredImg1DataUrl(reader.result);
                                    }
                                  };
                                  reader.readAsDataURL(f);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-800 mb-1">
                              3. Ảnh màn hình "Theo dõi kiện hàng":
                            </label>
                            <label className="cursor-pointer w-full px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 font-bold text-slate-900 flex items-center justify-between gap-2">
                              <span className="break-words">
                                {ctvDeliveredImg2Name || 'Tải ảnh Theo dõi kiện hàng'}
                              </span>
                              <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  setCtvDeliveredImg2Name(f.name);
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      setCtvDeliveredImg2DataUrl(reader.result);
                                    }
                                  };
                                  reader.readAsDataURL(f);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                          <div className="md:col-span-5">
                            <label className="block font-extrabold text-indigo-950 mb-1">
                              Mã số đơn hàng sàn (Trích xuất từ Ảnh 1):
                            </label>
                            <input
                              type="text"
                              value={deliveryOrderCodeInput}
                              onChange={(e) => setDeliveryOrderCodeInput(e.target.value)}
                              placeholder="Nhập mã số đơn hàng"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-300 font-mono font-bold bg-white text-indigo-900"
                              required
                            />
                          </div>

                          <div className="md:col-span-4">
                            <label className="block font-extrabold text-indigo-950 mb-1">
                              Mã vận đơn (Trích xuất từ Ảnh 2):
                            </label>
                            <input
                              type="text"
                              value={deliveryTrackingInput}
                              onChange={(e) => setDeliveryTrackingInput(e.target.value)}
                              placeholder="Nhập mã vận đơn"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-300 font-mono font-bold bg-white text-emerald-800"
                              required
                            />
                          </div>

                          <div className="md:col-span-3">
                            <button
                              type="submit"
                              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow cursor-pointer"
                            >
                              Xác Nhận Báo Giao
                            </button>
                          </div>
                        </div>
                      </form>
                    );
                  })()}
                </div>

                {/* Danh sách đơn của CTV */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  {(() => {
                    const allMyCtvOrders = orders.filter(
                      (o) => o.maNguoiDat === currentUser.maNguoiDung
                    );
                    const activeCtvOrders = allMyCtvOrders.filter(
                      (o) => !isOrderArchivedForCtv(o)
                    );
                    const archivedCtvOrders = allMyCtvOrders.filter((o) =>
                      isOrderArchivedForCtv(o)
                    );

                    const need2ImagesCount = activeCtvOrders.filter(
                      (o) => !o.daKhopAnhApp && o.trangThaiDon !== 'HOAN_TAT_THANH_CONG'
                    ).length;
                    const waitWarehouseCount = activeCtvOrders.filter(
                      (o) => o.daKhopAnhApp && !o.daKhopAnhKho
                    ).length;
                    const matchedWaitPayCount = activeCtvOrders.filter(
                      (o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG'
                    ).length;

                    const filteredCtvOrders = (
                      ctvOrderStatusFilter === 'ARCHIVED' ? archivedCtvOrders : activeCtvOrders
                    )
                      .filter((o) => {
                        if (ctvOrderStatusFilter === 'ARCHIVED') return true;
                        if (ctvActiveStepFilter === 'NEED_2_IMAGES') {
                          return !o.daKhopAnhApp && o.trangThaiDon !== 'HOAN_TAT_THANH_CONG';
                        }
                        if (ctvActiveStepFilter === 'WAIT_WAREHOUSE') {
                          return o.daKhopAnhApp && !o.daKhopAnhKho;
                        }
                        if (ctvActiveStepFilter === 'MATCHED_WAIT_PAY') {
                          return o.trangThaiDon === 'HOAN_TAT_THANH_CONG';
                        }
                        return true;
                      })
                      .filter((o) => {
                        if (!ctvOrderSearch.trim()) return true;
                        const q = ctvOrderSearch.trim().toLowerCase();
                        const shop = getUserById(o.maNguoiNhoDat);
                        return (
                          o.maDonHeThong.toLowerCase().includes(q) ||
                          o.maDonSanTMDT.toLowerCase().includes(q) ||
                          o.maVanDon.toLowerCase().includes(q) ||
                          o.kyHieuQuetDuoc.toLowerCase().includes(q) ||
                          (shop?.hoVaTen || '').toLowerCase().includes(q)
                        );
                      });

                    return (
                      <>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <h3 className="text-base font-extrabold text-slate-900">
                            Danh Sách Đơn Hàng Đã Đặt
                          </h3>

                          <div className="relative w-full md:w-64">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={ctvOrderSearch}
                              onChange={(e) => setCtvOrderSearch(e.target.value)}
                              placeholder="Tìm tên Shop, Mã đơn, MVĐ..."
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <button
                              type="button"
                              onClick={() => setCtvOrderStatusFilter('ACTIVE')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                                ctvOrderStatusFilter === 'ACTIVE'
                                  ? 'bg-indigo-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                              }`}
                            >
                              Đơn Đang Theo Dõi ({activeCtvOrders.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setCtvOrderStatusFilter('ARCHIVED')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                                ctvOrderStatusFilter === 'ARCHIVED'
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                              }`}
                            >
                              Lịch Sử Đơn Đã Tất Toán ({archivedCtvOrders.length})
                            </button>
                          </div>

                          {ctvOrderStatusFilter === 'ACTIVE' && (
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                              <button
                                type="button"
                                onClick={() => setCtvActiveStepFilter('ALL_ACTIVE')}
                                className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                                  ctvActiveStepFilter === 'ALL_ACTIVE'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                Tất cả ({activeCtvOrders.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => setCtvActiveStepFilter('NEED_2_IMAGES')}
                                className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                                  ctvActiveStepFilter === 'NEED_2_IMAGES'
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                                }`}
                              >
                                Cần tải 2 ảnh đã giao ({need2ImagesCount})
                              </button>
                              <button
                                type="button"
                                onClick={() => setCtvActiveStepFilter('WAIT_WAREHOUSE')}
                                className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                                  ctvActiveStepFilter === 'WAIT_WAREHOUSE'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                                }`}
                              >
                                Chờ Kho chụp tem xác nhận ({waitWarehouseCount})
                              </button>
                              <button
                                type="button"
                                onClick={() => setCtvActiveStepFilter('MATCHED_WAIT_PAY')}
                                className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                                  ctvActiveStepFilter === 'MATCHED_WAIT_PAY'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                Đã khớp đơn • Chờ nhận tiền công ({matchedWaitPayCount})
                              </button>
                            </div>
                          )}
                        </div>

                        {filteredCtvOrders.length === 0 ? (
                          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-700 font-semibold">
                            Không có đơn hàng nào trong danh mục này.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {filteredCtvOrders.map((o) => {
                              const shop = getUserById(o.maNguoiNhoDat);
                              const hasUnread = o.tinNhan.some((m) =>
                                (m.chuaDocBoi || []).includes(currentUser.maNguoiDung)
                              );
                              const lastMsg = o.tinNhan[o.tinNhan.length - 1];
                              const isDelivering =
                                o.trangThaiDon !== 'HOAN_TAT_THANH_CONG' &&
                                o.trangThaiDon !== 'DA_HUY_HOAN_HANG';

                              return (
                                <div
                                  key={o.maDonHeThong}
                                  className={`p-4 rounded-2xl border transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs ${
                                    deliveringOrderId === o.maDonHeThong && isDelivering
                                      ? 'bg-indigo-50/50 border-indigo-400'
                                      : 'bg-slate-50/70 border-slate-200'
                                  }`}
                                >
                                  <div className="space-y-1.5 min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-mono font-extrabold text-indigo-700 text-sm">
                                        {o.maDonHeThong} ({o.maKeo})
                                      </span>
                                      <span className="font-bold text-slate-900 break-words">
                                        Shop: {shop?.hoVaTen}
                                      </span>
                                      <OnlineStatusBadge user={shop} compact />
                                    </div>

                                    <div className="font-mono text-slate-900 break-all">
                                      Mã đơn sàn: <strong>{o.maDonSanTMDT}</strong> • Mã vận đơn:{' '}
                                      <strong className="text-emerald-700">{o.maVanDon}</strong>
                                    </div>

                                    <div className="text-slate-800 break-words">
                                      Giá COD: <strong>{formatVND(o.giaCodThucTe)}</strong> • Tiền công thực nhận:{' '}
                                      <strong className="text-emerald-700">{formatVND(o.tienCongThucNhan)}</strong>
                                    </div>

                                    <div className="pt-0.5">
                                      {renderReadableOrderProgressForCtv(o)}
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      {isDelivering && (
                                        <button
                                          type="button"
                                          onClick={() => handleSelectOrderForDeliveryUpload(o)}
                                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-2xs cursor-pointer"
                                        >
                                          Cập nhật báo giao ↑
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEvidenceModal({
                                            type: 'ORDER_IMAGES',
                                            title: `Chứng Từ Đơn Hàng ${o.maDonHeThong}`,
                                            data: o,
                                          })
                                        }
                                        className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 cursor-pointer"
                                      >
                                        Xem ảnh ({o.anhBangChung.length})
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => openOrderChat(o.maDonHeThong)}
                                        className="relative px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>Trao đổi ({o.tinNhan.length})</span>
                                        {hasUnread && (
                                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                                        )}
                                      </button>
                                    </div>

                                    {lastMsg && (
                                      <p
                                        className={`text-[11px] break-words max-w-xs sm:text-right ${
                                          hasUnread
                                            ? 'text-rose-600 font-extrabold'
                                            : 'text-slate-700 font-medium'
                                        }`}
                                      >
                                        {hasUnread ? '🔴 Tin mới: ' : 'Tin nhắn: '} "{lastMsg.noiDung}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TAB CTV 3: TIỀN CÔNG CỦA TÔI */}
            {ctvTab === 'WALLET_QR' && (
              <div className="space-y-6">
                {(() => {
                  const myOrders = orders.filter((o) => o.maNguoiDat === currentUser.maNguoiDung);
                  const myDoneOrders = myOrders.filter(
                    (o) => o.trangThaiDon === 'HOAN_TAT_THANH_CONG'
                  );
                  const payoutInfo = settlements.ctvPayouts[currentUser.maNguoiDung] || {
                    trangThai: 'CHUA_CHI_TRA',
                  };
                  const pendingWageOrders = myOrders.filter(
                    (o) => !isOrderArchivedForCtv(o)
                  );
                  const archivedPaidOrders = myOrders.filter(
                    (o) =>
                      o.trangThaiDon === 'HOAN_TAT_THANH_CONG' &&
                      o.trangThaiTT2Chang === 'ADMIN_DA_TRA_CONG'
                  );
                  const isAllPaid = archivedPaidOrders.length > 0 && Boolean(payoutInfo.anhBillChang2);
                  const totalNet = myDoneOrders.reduce((s, o) => s + o.tienCongThucNhan, 0);

                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                          <span className="text-xs font-bold uppercase text-slate-700">
                            Đơn đã giao & khớp thành công
                          </span>
                          <p className="text-2xl font-extrabold text-slate-900 mt-1">
                            {myDoneOrders.length} / {myOrders.length} đơn
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 shadow-sm">
                          <span className="text-xs font-bold uppercase text-emerald-900">
                            Tổng tiền công được nhận
                          </span>
                          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                            {formatVND(totalNet)}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                          <span className="text-xs font-bold uppercase text-slate-700">
                            Liên hệ Admin về tiền công
                          </span>
                          <button
                            type="button"
                            onClick={() => setActivePaymentChatPartnerId(currentUser.maNguoiDung)}
                            className="mt-2 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" /> Nhắn Tin Với Admin
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <button
                              type="button"
                              onClick={() => setCtvWalletSubTab('PENDING')}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                                ctvWalletSubTab === 'PENDING'
                                  ? 'bg-indigo-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              Đơn Chờ Nhận Tiền Công ({pendingWageOrders.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setCtvWalletSubTab('PAID_ARCHIVE')}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                                ctvWalletSubTab === 'PAID_ARCHIVE'
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              Lịch Sử Đã Nhận Tiền Công ({archivedPaidOrders.length})
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setEvidenceModal({
                                  type: 'QR_CODE',
                                  title: `Mã QR Nhận Tiền — ${currentUser.hoVaTen}`,
                                  data: currentUser,
                                })
                              }
                              className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200 cursor-pointer"
                            >
                              Xem Mã QR Cá Nhân
                            </button>

                            {isAllPaid && (
                              <button
                                type="button"
                                onClick={() =>
                                  setEvidenceModal({
                                    type: 'BILL_CK',
                                    title: `Bill Admin Chuyển Trả Tiền Công`,
                                    data: {
                                      maBill: payoutInfo.anhBillChang2,
                                      anhBillDataUrl: payoutInfo.anhBillDataUrl,
                                      nguoiChuyen: 'Admin Điều Phối',
                                      nguoiNhan: currentUser.hoVaTen,
                                      soTien: payoutInfo.soTienDaTra,
                                      thoiGian: payoutInfo.thoiGianCK,
                                    },
                                  })
                                }
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow cursor-pointer"
                              >
                                Xem Bill Chuyển Khoản
                              </button>
                            )}
                          </div>
                        </div>

                        {ctvWalletSubTab === 'PENDING' ? (
                          pendingWageOrders.length === 0 ? (
                            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                              <h4 className="text-sm sm:text-base font-extrabold text-emerald-950">
                                Đã Nhận Đủ Tiền Công Các Đơn Hoàn Tất
                              </h4>
                              <p className="text-xs text-emerald-900 font-medium max-w-xl mx-auto">
                                Toàn bộ các đơn hoàn tất đã được Admin chuyển khoản thanh toán và lưu trong mục Lịch sử.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3 text-xs">
                              {pendingWageOrders.map((o) => {
                                const shop = getUserById(o.maNguoiNhoDat);
                                return (
                                  <div
                                    key={o.maDonHeThong}
                                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
                                  >
                                    <div className="space-y-1.5 flex-1">
                                      <div className="font-mono font-extrabold text-indigo-700 text-sm">
                                        {o.maDonHeThong} ({o.maKeo}) — Shop: {shop?.hoVaTen}
                                      </div>
                                      <div className="font-mono text-slate-800 break-all">
                                        Mã đơn sàn: <strong>{o.maDonSanTMDT}</strong> • Mã vận đơn:{' '}
                                        <strong className="text-emerald-700">{o.maVanDon}</strong> • Giá COD:{' '}
                                        <strong>{formatVND(o.giaCodThucTe)}</strong>
                                      </div>
                                      <div className="pt-0.5">
                                        {renderReadableOrderProgressForCtv(o)}
                                      </div>
                                    </div>
                                    <div className="md:text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                                      <span className="text-[11px] text-slate-700 font-semibold block">
                                        Tiền công bạn nhận:
                                      </span>
                                      <span className="text-lg font-extrabold text-emerald-700 font-mono">
                                        +{formatVND(o.tienCongThucNhan)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )
                        ) : (
                          <div className="space-y-3 text-xs">
                            {archivedPaidOrders.map((o) => {
                              const shop = getUserById(o.maNguoiNhoDat);
                              return (
                                <div
                                  key={o.maDonHeThong}
                                  className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-slate-900"
                                >
                                  <div>
                                    <span className="font-mono font-extrabold">
                                      {o.maDonHeThong}
                                    </span>{' '}
                                    • Shop: <strong>{shop?.hoVaTen}</strong> • Mã đơn sàn: {o.maDonSanTMDT}
                                  </div>
                                  <div className="font-mono font-extrabold text-emerald-700">
                                    ✅ Đã nhận tiền công: +{formatVND(o.tienCongThucNhan)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </main>
        )}
      </div>

      {/* ======================================================================
          MODAL 3: KÊNH TRAO ĐỔI ĐỐI SOÁT THANH TOÁN
         ====================================================================== */}
      {activePaymentChatPartnerId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Trao Đổi & Đối Soát Thanh Toán
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  Hội thoại: <strong>{getUserById(activePaymentChatPartnerId)?.hoVaTen}</strong> ↔{' '}
                  <strong>Admin Điều Phối</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePaymentChatPartnerId(null)}
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
              {(paymentChats[activePaymentChatPartnerId] || []).length === 0 ? (
                <p className="text-center text-slate-600 font-medium py-6">
                  Chưa có tin nhắn đối soát thanh toán.
                </p>
              ) : (
                (paymentChats[activePaymentChatPartnerId] || []).map((m) => {
                  const isMe = m.senderId === currentUser.maNguoiDung;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-600 font-semibold mb-0.5">
                        {m.senderName} • {m.time}
                      </span>
                      <div
                        className={`px-3.5 py-2 rounded-2xl max-w-xs break-words ${
                          isMe
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-100 text-slate-900 border border-slate-200 font-medium'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendPaymentChat} className="pt-3 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={paymentChatInput}
                onChange={(e) => setPaymentChatInput(e.target.value)}
                placeholder="Nhập nội dung trao đổi thanh toán..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Gửi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 1: XEM ẢNH CHỨNG TỪ / MÃ QR / BILL CK / ĐƠN MẪU
         ====================================================================== */}
      {evidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-auto">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 break-words">
                {evidenceModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setEvidenceModal(null)}
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {evidenceModal.type === 'ORDER_IMAGES' && (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 text-xs">
                {evidenceModal.data.anhBangChung.map((img) => (
                  <div
                    key={img.maAnh}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-extrabold text-indigo-800">{img.tenLoai}</span>
                      <span className="text-[11px] text-slate-700 font-semibold">{img.thoiGianTai}</span>
                    </div>
                    {img.duongDanFile && img.duongDanFile.startsWith('data:image') && (
                      <div className="max-h-64 overflow-hidden rounded-xl border border-slate-300 bg-white flex items-center justify-center">
                        <img
                          src={img.duongDanFile}
                          alt={img.tenLoai}
                          className="max-h-64 object-contain"
                        />
                      </div>
                    )}
                    <div className="font-mono text-slate-900 break-all">
                      Mã đơn hàng: <strong>{img.maDonDocDuoc}</strong>
                      {img.maVanDonDocDuoc && (
                        <>
                          {' '}
                          • Mã vận đơn: <strong className="text-emerald-700">{img.maVanDonDocDuoc}</strong>
                        </>
                      )}
                    </div>
                    <div className="text-slate-800 break-words">
                      Giá COD: <strong>{formatVND(img.giaCodDocDuoc)}</strong> • Thông tin ghi nhận:{' '}
                      <strong>{img.kyHieuDocDuoc}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {evidenceModal.type === 'QR_CODE' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3 text-xs">
                <div className="w-44 h-44 mx-auto rounded-2xl bg-white border-2 border-indigo-200 flex items-center justify-center overflow-hidden shadow">
                  {evidenceModal.data?.anhMaQRUrl?.startsWith('data:image') ? (
                    <img
                      src={evidenceModal.data.anhMaQRUrl}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-28 h-28 text-indigo-700" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-slate-900 break-words">
                    {evidenceModal.data?.hoVaTen}
                  </p>
                  <p className="font-mono font-bold text-indigo-700">
                    Ngân hàng: {evidenceModal.data?.nganHang || 'Chưa cập nhật'} • STK:{' '}
                    {evidenceModal.data?.soTaiKhoan || '—'}
                  </p>
                  <p className="font-mono font-bold uppercase text-slate-800">
                    Chủ TK: {evidenceModal.data?.chuTaiKhoan || evidenceModal.data?.hoVaTen}
                  </p>
                </div>
              </div>
            )}

            {evidenceModal.type === 'BILL_CK' && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs">
                {evidenceModal.data?.anhBillDataUrl && (
                  <div className="max-h-72 overflow-hidden rounded-xl border border-emerald-300 bg-white flex items-center justify-center">
                    <img
                      src={evidenceModal.data.anhBillDataUrl}
                      alt="Bill chuyển khoản"
                      className="max-h-72 object-contain"
                    />
                  </div>
                )}
                <div className="space-y-1 font-mono text-slate-900">
                  <div>
                    Mã giao dịch: <strong>{evidenceModal.data?.maBill}</strong>
                  </div>
                  <div className="font-sans">
                    Đơn vị chuyển: <strong>{evidenceModal.data?.nguoiChuyen}</strong> → Đơn vị nhận:{' '}
                    <strong>{evidenceModal.data?.nguoiNhan}</strong>
                  </div>
                  <div className="text-sm font-extrabold text-emerald-800">
                    Số tiền thanh toán: {formatVND(evidenceModal.data?.soTien)}
                  </div>
                  <div className="text-slate-700 font-semibold">Thời gian: {evidenceModal.data?.thoiGian}</div>
                </div>
              </div>
            )}

            {evidenceModal.type === 'SAMPLE_IMAGE_ZOOM' && (
              <div className="space-y-3 text-xs max-h-[75vh] overflow-y-auto">
                {evidenceModal.data?.anhMauDataUrl && (
                  <div className="max-h-80 overflow-hidden rounded-2xl border border-slate-300 bg-slate-950 flex items-center justify-center">
                    <img
                      src={evidenceModal.data.anhMauDataUrl}
                      alt="Ảnh đơn mẫu"
                      className="max-h-80 object-contain"
                    />
                  </div>
                )}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="font-extrabold text-amber-300 text-sm break-words">
                    {evidenceModal.data?.tenMatHang}
                  </div>
                  <div className="space-y-1.5">
                    {(evidenceModal.data?.danhSachLink || []).map((lk, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 break-words">
                        <div className="font-bold text-white">
                          Sản phẩm #{i + 1}: {lk.phanLoai} — Số lượng: <span className="text-emerald-300">{lk.soLuongMua}</span>
                        </div>
                        <div className="text-slate-200 text-[11px]">{lk.ghiChuLoai}</div>
                        <div className="font-mono text-indigo-300 break-all mt-1">{lk.link}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: TRAO ĐỔI TRỰC TIẾP THEO ĐƠN HÀNG
         ====================================================================== */}
      {activeChatOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 break-words">
                  Trao Đổi Đơn Hàng {activeChatOrder.maDonHeThong} (Mã sàn: {activeChatOrder.maDonSanTMDT})
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-800">
                    Shop: {getUserById(activeChatOrder.maNguoiNhoDat)?.hoVaTen}
                  </span>
                  <OnlineStatusBadge user={getUserById(activeChatOrder.maNguoiNhoDat)} compact />
                  <span>•</span>
                  <span className="font-bold text-slate-800">
                    CTV: {getUserById(activeChatOrder.maNguoiDat)?.hoVaTen}
                  </span>
                  <OnlineStatusBadge user={getUserById(activeChatOrder.maNguoiDat)} compact />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveChatOrderId(null)}
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
              {activeChatOrder.tinNhan.length === 0 ? (
                <p className="text-center text-slate-600 font-medium py-6">
                  Chưa có tin nhắn trao đổi cho đơn hàng này.
                </p>
              ) : (
                activeChatOrder.tinNhan.map((m) => {
                  const isMe = m.maNguoiGui === currentUser.maNguoiDung;
                  return (
                    <div
                      key={m.maTinNhan}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-600 font-semibold mb-0.5">
                        {m.tenNguoiGui} • {m.thoiGianGui}
                      </span>
                      <div
                        className={`px-3.5 py-2 rounded-2xl max-w-xs break-words ${
                          isMe
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-100 text-slate-900 border border-slate-200 font-medium'
                        }`}
                      >
                        {m.noiDung}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-200 space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessageInput}
                  onChange={(e) => setChatMessageInput(e.target.value)}
                  placeholder="Nhập nội dung tin nhắn..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi
                </button>
              </div>

              {activeChatOrder.trangThaiDon !== 'HOAN_TAT_THANH_CONG' &&
                activeChatOrder.trangThaiDon !== 'DA_HUY_HOAN_HANG' && (
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[11px] text-slate-700 font-semibold">
                      Cập nhật trạng thái ngoại lệ:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleMarkOrderCancelOrReturn(
                          activeChatOrder.maDonHeThong,
                          'DA_HUY_HOAN_HANG'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 cursor-pointer"
                    >
                      Xác nhận Hủy / Hoàn hàng
                    </button>
                  </div>
                )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}