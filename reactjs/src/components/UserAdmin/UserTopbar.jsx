import { useNavigate } from "react-router-dom";

const UserTopbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand bg-white border-bottom px-3 px-md-4">

      {/* LEFT: TOGGLE + TITLE */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary d-lg-none"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <span className="fw-semibold text-dark">
          Welcome, {user?.name || "User"}
        </span>
      </div>

      {/* RIGHT: PROFILE */}
      <div className="dropdown ms-auto">
        <button
          className="btn d-flex align-items-center gap-2"
          data-bs-toggle="dropdown"
        >
          <img
            src={user?.avatar || "https://via.placeholder.com/32"}
            alt="User"
            className="rounded-circle"
            width="32"
            height="32"
          />
        </button>

        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
          <li>
            <button
              className="dropdown-item"
              onClick={() => navigate("/user/profile")}
            >
              Profile
            </button>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button
              className="dropdown-item text-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

    </nav>
  );
};

export default UserTopbar;
