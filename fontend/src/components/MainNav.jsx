import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";

export default function MainNav({ shrink = false }) {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/dich-vu\/([^/]+)/);
  const currentCategory = match ? match[1] : null;

  const servicesList = [
    { slug: "trong-rang-implant", label: "Trồng răng Implant" },
    { slug: "nieng-rang", label: "Niềng răng" },
    { slug: "nha-khoa-tong-quat", label: "Nha khoa tổng quát" },
    { slug: "nha-khoa-tre-em", label: "Nha khoa trẻ em" },
  ];

  const isServicesRoot = pathname.startsWith("/dich-vu");

  return (
    <nav
      className={`transition-all duration-500 ${
        shrink
          ? "bg-gradient-to-r from-blue-900 via-green-700 to-green-600 py-2 shadow-xl"
          : "bg-gradient-to-r from-blue-700 via-green-600 to-green-500 py-4 shadow-md"
      } z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <ul
          className={`flex flex-wrap space-x-8 font-semibold text-white transition-all duration-500 ${
            shrink ? "text-sm" : "text-base"
          }`}
        >
          <li>
            <Link to="/" className="relative group transition">
              Trang chủ
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link to="/gioi-thieu" className="relative group transition">
              Giới thiệu
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link to="/bang-gia" className="relative group transition">
              Bảng giá
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>

          {/* Dropdown Dịch vụ */}
          <li className="relative">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  className={`relative group inline-flex items-center gap-1 focus:outline-none ${
                    isServicesRoot
                      ? "text-yellow-300 font-semibold"
                      : "hover:text-yellow-300"
                  }`}
                >
                  Dịch vụ
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-1 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 -translate-y-1 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left bg-white border shadow-lg rounded-xl z-50 p-1">
                  {servicesList.map((service) => {
                    const activeCat = currentCategory === service.slug;
                    return (
                      <Menu.Item key={service.slug}>
                        {({ active }) => (
                          <Link
                            to={`/dich-vu/${service.slug}`}
                            className={`block px-4 py-2 rounded-lg transition ${
                              active
                                ? "bg-gray-100"
                                : "hover:bg-green-50 hover:text-green-700"
                            } ${
                              activeCat
                                ? "bg-green-100 text-green-700 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {service.label}
                          </Link>
                        )}
                      </Menu.Item>
                    );
                  })}
                </Menu.Items>
              </Transition>
            </Menu>
          </li>

          <li>
            <Link to="/kien-thuc" className="relative group transition">
              Kiến thức nha khoa
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link to="/tim-phong-kham" className="relative group transition">
              Tìm phòng khám
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
