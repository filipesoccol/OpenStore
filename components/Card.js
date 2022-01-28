import Image from "next/image";
import styles from "../styles/Card.module.css"
import MaticIcon from "./MaticIcon.js"

export default function Card({ data, buyNft, k }) {

  const handleOpenPreview = () => {
    document.dispatchEvent(new CustomEvent('openpreview', {'detail': data}))
  }

  return (
    <div key={k} className="mb-5 mr-4">
      <div className="card shadow margin-56">
        <div>
        <Image
          className={styles.cardImgTop}
          src={data.image}
          alt="Card image cap"
          width={200}
          height={200}
          onClick={handleOpenPreview}
        />
        </div>
        <div className="card-body">
          <h5 className="card-title" id="namepr{{i.id}}">
            {data.name}
          </h5>
          <h5 className="card-title">
            {data.price} <MaticIcon/>
          </h5>
          <div className="row">
            <div className="col-6">
              <button
                onClick={() => buyNft(data)}
                id="qv{{i.id}}"
                className="commonbuttons"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
