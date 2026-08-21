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
      <div
        style={{
          width: "min(40vh, 80vw)",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src="/IMG_4307.jpeg"
          alt="Emblem"
          style={{
            width: "114%",
            height: "114%",
            objectFit: "cover",
            transform: "translate(-6%, -6%)",
          }}
        />
      </div>
    </main>
  );
}
