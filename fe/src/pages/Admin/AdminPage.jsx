import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Taskbar/Taskbar';
import Header from '../components/Header';

const AdminPage = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-4 bg-gray-100 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
