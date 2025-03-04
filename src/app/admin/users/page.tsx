import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function UsersPage() {
  // Örnek kullanıcı verileri
  const users = [
    {
      id: "USR-001",
      name: "Ahmet Yılmaz",
      email: "ahmet.yilmaz@example.com",
      role: "Admin",
      status: "Aktif",
      lastLogin: "2023-12-15T14:30:00",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: "USR-002",
      name: "Ayşe Demir",
      email: "ayse.demir@example.com",
      role: "Müşteri",
      status: "Aktif",
      lastLogin: "2023-12-14T10:15:00",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: "USR-003",
      name: "Mehmet Kaya",
      email: "mehmet.kaya@example.com",
      role: "Müşteri",
      status: "Aktif",
      lastLogin: "2023-12-13T16:45:00",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: "USR-004",
      name: "Zeynep Çelik",
      email: "zeynep.celik@example.com",
      role: "Müşteri",
      status: "Pasif",
      lastLogin: "2023-12-10T09:20:00",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: "USR-005",
      name: "Mustafa Şahin",
      email: "mustafa.sahin@example.com",
      role: "Editör",
      status: "Aktif",
      lastLogin: "2023-12-12T11:30:00",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
      id: "USR-006",
      name: "Elif Yıldız",
      email: "elif.yildiz@example.com",
      role: "Müşteri",
      status: "Aktif",
      lastLogin: "2023-12-11T13:45:00",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
      id: "USR-007",
      name: "Burak Öztürk",
      email: "burak.ozturk@example.com",
      role: "Müşteri",
      status: "Pasif",
      lastLogin: "2023-12-08T15:10:00",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
      id: "USR-008",
      name: "Selin Aydın",
      email: "selin.aydin@example.com",
      role: "Müşteri",
      status: "Aktif",
      lastLogin: "2023-12-09T17:25:00",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg"
    }
  ];

  // Kullanıcı durumuna göre renk sınıfı belirleme
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800";
      case "Pasif":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Kullanıcı rolüne göre renk sınıfı belirleme
  const getRoleColorClass = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Editör":
        return "bg-blue-100 text-blue-800";
      case "Müşteri":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FaFilter className="mr-2 h-4 w-4" />
            Filtrele
          </button>
          <Link 
            href="/admin/users/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaUserPlus className="mr-2 h-4 w-4" />
            Yeni Kullanıcı
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-posta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColorClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastLogin).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/users/${user.id}`} className="text-indigo-600 hover:text-indigo-900">
                        <FaEye className="h-5 w-5" />
                      </Link>
                      <Link href={`/admin/users/${user.id}/edit`} className="text-blue-600 hover:text-blue-900">
                        <FaEdit className="h-5 w-5" />
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Önceki
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sonraki
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Toplam <span className="font-medium">8</span> kullanıcı
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Önceki</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Sonraki</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 