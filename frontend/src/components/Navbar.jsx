import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/login"); // redirect to login
  };

  return (
    <nav
      style={{
        padding: "10px 20px",
        background: "#282c34",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left side - Brand */}
      <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
        MyApp
      </div>

      {/* Right side - Links */}
      <div>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/problem" style={linkStyle}>
          Problems
        </Link>
        <Link to="/submission/:userId" style={linkStyle}>
          Submissions
        </Link>

        {!token ? (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              ...linkStyle,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  marginLeft: "15px",
};

export default Navbar;
