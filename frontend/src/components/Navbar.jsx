// import { Link, useNavigate } from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // clear token
//     navigate("/login"); // redirect to login
//   };

//   return (
//     <nav
//       style={{
//         padding: "10px 20px",
//         background: "#282c34",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//       }}
//     >
//       {/* Left side - Brand */}
//       <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
//         MyApp
//       </div>

//       {/* Right side - Links */}
//       <div>
//         <Link to="/" style={linkStyle}>
//           Home
//         </Link>
//         <Link to="/problem" style={linkStyle}>
//           Problems
//         </Link>
//         <Link to="/submission/:userId" style={linkStyle}>
//           Submissions
//         </Link>

//         {!token ? (
//           <>
//             <Link to="/login" style={linkStyle}>
//               Login
//             </Link>
//             <Link to="/register" style={linkStyle}>
//               Register
//             </Link>
//           </>
//         ) : (
//           <button
//             onClick={handleLogout}
//             style={{
//               ...linkStyle,
//               background: "transparent",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }

// const linkStyle = {
//   color: "#fff",
//   textDecoration: "none",
//   marginLeft: "15px",
// };

// export default Navbar;


// import { Link, useNavigate } from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // clear token
//     navigate("/login"); // redirect to login
//   };

//   return (
//     <nav
//       style={{
//         padding: "10px 20px",
//         background: "#282c34",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//       }}
//     >
//       {/* Left side - Brand */}
//       <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
//         MyApp
//       </div>

//       {/* Right side - Links */}
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <Link to="/" style={linkStyle}>
//           Home
//         </Link>
//         <Link to="/problem" style={linkStyle}>
//           Problems
//         </Link>
//         <Link to="/submission/:userId" style={linkStyle}>
//           Submissions
//         </Link>

//         {!token ? (
//           <>
//             <Link to="/login" style={linkStyle}>
//               Login
//             </Link>
//             <Link to="/register" style={linkStyle}>
//               Register
//             </Link>
//           </>
//         ) : (
//           <>
//             {/* Profile Circle */}
//             <div
//               onClick={() => navigate("/profile")}
//               style={{
//                 width: "35px",
//                 height: "35px",
//                 borderRadius: "50%",
//                 backgroundColor: "#61dafb",
//                 color: "#282c34",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginLeft: "15px",
//                 cursor: "pointer",
//                 fontWeight: "bold",
//               }}
//             >
//               {/* Just first letter of username for now */}
//               U
//             </div>

//             <button
//               onClick={handleLogout}
//               style={{
//                 ...linkStyle,
//                 background: "transparent",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// const linkStyle = {
//   color: "#fff",
//   textDecoration: "none",
//   marginLeft: "15px",
// };

// export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // decode JWT
        setUsername(decoded.userhandle || "U");
      } catch {
        setUsername("U");
      }
      setShowDropdown(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
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
          <>
            {/* Profile Circle as Dropdown Trigger */}
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#61dafb",
                color: "#282c34",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "15px",
                cursor: "pointer",
                fontWeight: "bold",
                userSelect: "none",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  right: "0",
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <button
                  onClick={() => {
                        setShowDropdown(false);   // close dropdown
                        navigate("/profile");}
                      }
                  style={dropdownItem}
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={dropdownItem}
                >
                  Logout
                </button>
              </div>
            )}
          </>
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

const dropdownItem = {
  display: "block",
  padding: "10px 20px",
  width: "100%",
  textAlign: "left",
  background: "white",
  border: "none",
  cursor: "pointer",
};

export default Navbar;
