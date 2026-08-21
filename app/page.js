export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#6C3BAA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/IMG_4307.jpeg"
        alt="Emblem"
        style={{
          width: "min(40vh, 80vw)",
          height: "auto",
          borderRadius: "50%",
        }}
      />
    </main>
  );
}
