import React from 'react';

const Header = () => {
    return (
        <header className="bg-white shadow px-6 py-3 flex justify-end items-center">
            <div className="flex items-center space-x-3">
                <div className="text-right">
                    <p className="font-semibold text-sm">Nguyễn Phương Quyên</p>
                    <p className="text-xs text-gray-500">admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-cente   r justify-center font-bold text-lg">
                    A
                </div>
            </div>
        </header>
    );
};

export default Header;
