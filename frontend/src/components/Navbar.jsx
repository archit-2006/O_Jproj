import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      padding: "10px 20px",
      background: "#282c34",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      {/* Left side - Brand */}
      <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
        MyApp
      </div>

      {/* Right side - Links */}
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/problem" style={linkStyle}>Problems</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/register" style={linkStyle}>Register</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  marginLeft: "15px"
};

export default Navbar;
