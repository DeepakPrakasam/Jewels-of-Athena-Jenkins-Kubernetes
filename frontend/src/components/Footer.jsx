function Footer() {
  return (
    <footer
      className="text-white pt-5 pb-4 mt-5"
      style={{
        background: "linear-gradient(to right, hsl(327, 100%, 87%), #e090fd)",
      }}
    >
      <div className="container text-md-left">
        <div className="row text-md-left">
          {/* QR and App Icons */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">
              Dhandapani Jewellery
            </h5>
            <i className="fas fa-qrcode fa-2x mb-3"></i>
            <br />
            <i className="fab fa-google-play fa-2x me-3"></i>
            <i className="fab fa-apple fa-2x"></i>
          </div>

          {/* Useful Links */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">
              Useful Links
            </h5>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Delivery Information
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                International Shipping
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Payment Options
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Track your Order
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Returns
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Find a Store
              </a>
            </p>
          </div>

          {/* Information */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">
              Information
            </h5>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Blog
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Offers & Contest Details
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Help & FAQs
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                About Dhandapani Jewellery
              </a>
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none">
                Contact Us
              </a>
            </p>
          </div>

          {/* Contact & Chat */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">Contact</h5>
            <p>
              <i className="fas fa-phone me-2"></i>1800-266-0123
            </p>
            <p>
              <i className="fas fa-comment-dots me-2"></i>+91 8147349242
            </p>
            <p>
              <i className="fab fa-whatsapp fa-lg me-3"></i>
              <i className="fas fa-envelope fa-lg me-3"></i>
              <i className="fas fa-comments fa-lg"></i>
            </p>
          </div>
        </div>

        {/* Social & Payment Icons */}
        <div className="row text-center mt-4">
          <div className="col-md-6">
            <h5 className="text-uppercase mb-3">Follow Us</h5>
            <a href="#">
              <i className="fab fa-instagram fa-lg text-white me-3"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter fa-lg text-white me-3"></i>
            </a>
            <a href="#">
              <i className="fab fa-facebook fa-lg text-white me-3"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube fa-lg text-white"></i>
            </a>
          </div>
          <div className="col-md-6">
            <h5 className="text-uppercase mb-3">We Accept</h5>
            <i className="fab fa-cc-visa fa-lg text-white me-3"></i>
            <i className="fab fa-cc-mastercard fa-lg text-white me-3"></i>
            <i className="fab fa-cc-paypal fa-lg text-white me-3"></i>
            <i className="fab fa-cc-amex fa-lg text-white me-3"></i>
            <i className="fab fa-cc-discover fa-lg text-white"></i>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="row mt-4">
          <div className="col text-center">
            <p className="mb-1">
              © 2025 Dhandapani Jewellery. All Rights Reserved.
            </p>
            <p>
              <a href="#" className="text-white text-decoration-none me-3">
                Terms & Conditions
              </a>
              <a href="#" className="text-white text-decoration-none me-3">
                Privacy Policy
              </a>
              <a href="#" className="text-white text-decoration-none">
                Disclaimer
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
