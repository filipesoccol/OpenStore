import Image from "next/image";

export default function Team() {
  return (
    <div className="background-black" style={{ minHeight: "70vh" }}>
      <div className="container">
        <div className="title">
          <br />
          <br />
          <h1 className="title-main text-center">
            <b>Drop Table Teams</b>
          </h1>
          <br />
          <br />
        </div>

        <div className="row">
          <div className="col-md-4 my-3 text-center">
            <div className="top-image">
              <Image
                width="200px"
                height="200px"
                className="hover-effect-zoom"
                src="https://avatars.githubusercontent.com/u/61423235?s=460&u=7ef56fda424474b260d3f88a0a07ae6da385953b&v=4"
                alt="Aakash"
                loading="lazy"
              />
            </div>
            <div className="bottom mb-3">
              <h5 className="text-center my-4">
                <b>Aakash</b>
              </h5>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
