// src/components/Carousel.jsx
function Carousel() {
  return (
    <>
      <div id="demo" className="carousel slide mt-3" data-bs-ride="carousel">
        {/* Indicators */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#demo"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#demo"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#demo"
            data-bs-slide-to="2"
          ></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/floral.png"
              alt="Floral"
              className="d-block img-fluid"
              style={{ height: "350px", width: "100%" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="/pic1.webp"
              alt="Gold"
              className="d-block img-fluid"
              style={{ height: "350px", width: "100%" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="/pic2.webp"
              alt="Silver"
              className="d-block img-fluid"
              style={{ height: "350px", width: "100%" }}
            />
          </div>
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#demo"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#demo"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      <h1
        style={{ fontFamily: "Merriweather, serif" }}
        className="d-flex justify-content-center mt-4"
      >
        <strong>
          <i>Find Your Perfect Match</i>
        </strong>
      </h1>
      <i>
        <p
          className="text-center"
          style={{ fontFamily: "Merriweather, serif", fontSize: "large" }}
        >
          We live every second of our day. Why not make every moment special?
        </p>
      </i>
    </>
  );
}

export default Carousel;
