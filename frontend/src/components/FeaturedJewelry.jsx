import React from "react";

const FeaturedJewelry = () => {
  return (
    <div style={{ marginBottom: "15%" }}>
      <h1
        style={{
          fontFamily: "Merriweather, serif",
          marginTop: "5%",
        }}
        className="d-flex justify-content-center"
      >
        <strong>
          <i>Curated For You</i>
        </strong>
      </h1>

      <div
        className="container-fluid d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: "url('/new-arrivals-background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "410px",
          width: "100%",
          marginTop: "2%",
          padding: "40px 0",
          position: "relative",
        }}
      >
        {/* Top-left text */}
        <i>
          <h2
            className="position-absolute text-white"
            style={{
              top: "10px",
              left: "15px",
              margin: "0",
              fontWeight: "bold",
              textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            Trust us to be part of your precious moments and to deliver
            jewellery that you'll cherish forever.
          </h2>
        </i>

        {/* Carousel for small/medium screens */}
        <div
          id="carouselExampleIndicators"
          className="carousel slide d-block d-lg-none"
          data-bs-ride="carousel"
          style={{ width: "80%", marginTop: "60%" }}
        >
          <div className="carousel-inner">
            {/* Slide 1: Nosepin */}
            <div className="carousel-item active">
              <img
                className="d-block w-100 rounded-4"
                src="/nosepin.webp"
                alt="Nosepin"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5
                  style={{
                    fontWeight: "bold",
                    textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                  }}
                >
                  Nosepin
                </h5>
              </div>
            </div>

            {/* Slide 2: Kids Jewellery */}
            <div className="carousel-item">
              <img
                className="d-block w-100 rounded-4"
                src="/kids-jewellery.webp"
                alt="Kids Jewellery"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5
                  style={{
                    fontWeight: "bold",
                    textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                  }}
                >
                  Kids-Jewellery
                </h5>
              </div>
            </div>
          </div>

          {/* Carousel controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Grid for large screens */}
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 g-4 d-none d-lg-flex">
          {/* Nosepin */}
          <div className="col">
            <div
              className="card rounded-4 position-relative p-2"
              style={{ marginTop: "70%", width: "630px", height: "330px" }}
            >
              <img
                className="card-img-top img-fluid rounded-top rounded-4"
                src="/nosepin.webp"
                alt="Nosepin"
                style={{ height: "310px", width: "100%", objectFit: "cover" }}
              />
              <h4
                className="position-absolute text-white"
                style={{
                  bottom: "10px",
                  left: "15px",
                  margin: "0",
                  fontWeight: "bold",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                Nosepin
              </h4>
            </div>
          </div>

          {/* Kids Jewellery */}
          <div className="col">
            <div
              className="card rounded-4 position-relative p-2"
              style={{ marginTop: "70%", width: "630px", height: "330px" }}
            >
              <img
                className="card-img-top img-fluid rounded-top rounded-4"
                src="/kids-jewellery.webp"
                alt="Kids Jewellery"
                style={{ height: "310px", width: "100%", objectFit: "cover" }}
              />
              <h4
                className="position-absolute text-white"
                style={{
                  bottom: "10px",
                  left: "15px",
                  margin: "0",
                  fontWeight: "bold",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                Kids-Jewellery
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedJewelry;
