function Home() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>Welcome to MyApp</h1>
        <p style={styles.subtitle}>
          A platform to practice coding problems, track your progress, and improve your skills.
        </p>
        <a href="/problem" style={styles.ctaButton}>Start Solving Problems</a>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featureCard}>
          <h2>📚 Practice Problems</h2>
          <p>Explore a wide range of coding challenges and test your skills.</p>
        </div>
        <div style={styles.featureCard}>
          <h2>📊 Track Progress</h2>
          <p>Monitor your problem-solving journey with detailed analytics.</p>
        </div>
        <div style={styles.featureCard}>
          <h2>👤 Personalized Experience</h2>
          <p>Sign in to save your progress and access tailored challenges.</p>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  hero: {
    padding: "50px 20px",
    background: "#282c34",
    color: "#fff",
    borderRadius: "10px",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  ctaButton: {
    background: "#61dafb",
    padding: "10px 20px",
    borderRadius: "5px",
    color: "#000",
    textDecoration: "none",
    fontWeight: "bold",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  featureCard: {
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
};

export default Home;
