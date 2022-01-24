import Image from "next/image";
import { useEffect, useState } from "react";
import styles from '../styles/ItemModal.module.css'

export default function ItemModal() {
  const [status, setStatus] = useState('opened')
  const [data, setData] = useState()

  useEffect(() => {
    document.addEventListener('openpreview', handleOpenPreview);
  }, []);

  const handleOpenPreview = async (e) => {
    console.log(e.detail)
    setData(e.detail)
    setStatus('opened')
  }

  const handleCloseModal = async () => {
    setStatus('closed')
    setData()
  }

  return (
    <>
      {status !== 'closed' && data && (
      <div className={styles.modalwidget}>
        <div className={styles.modalcontent}>
          <div
            className={`close ${status == 'opened'}`}
            onClick={handleCloseModal}
          >
            &times;
          </div>
          <div className="m-4 row">
            <div className="col-4">
            <Image
              src={data.image}
              alt="Card image cap"
              width={200}
              height={200}
            />
            </div>
            <div className="col-6">
              <h5 className="card-title" id="namepr{{i.id}}">
                {data.name}
              </h5>
              <h5 className="card-title">
                {data.price} <b>ETH</b>
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
              <br />
              <p className="card-text">{data.description}</p>
            </div>
          </div>
        </div>
      </div>)}
    </>
  );
}
