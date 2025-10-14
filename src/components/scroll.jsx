import styled from "styled-components";

const Card = () => {
  return (
    <StyledWrapper>
      <div className="marquee">
        <div className="marquee__inner">
          <div className="marquee__group">
            <span>
              <img
                src="https://png.pngtree.com/png-vector/20230808/ourmid/pngtree-table-toy-vector-png-image_6894285.png"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-cute-bear-teddy-toy-png-image_10149481.png"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://file.aiquickdraw.com/imgcompressed/img/compressed_110cc86a7b0aac01ef255718bcbb6b4c.webp"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://www.pngmart.com/files/12/Sheriff-Woody-Toy-Story-Transparent-Background.png"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://gallery.yopriceville.com/downloadfullsize/send/8468"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://file.aiquickdraw.com/imgcompressed/img/compressed_870b9fb36c4199c3cbe286fe9ff42978.webp"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://popweasel.co.nz/cdn/shop/files/JAD98033--Cars-Cruising-Lightning-McQueen-124-Diecast-Vehicle-01_600x600_crop_center.png?v=1716356495"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://www.nicepng.com/png/detail/809-8094268_optimus-prime-stands-optimus-prime.png"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://www.pngitem.com/pimgs/m/429-4295476_bumblebee-transformer-transparent-background-hd-png-download.png"
                alt="toy"
                className="w-20"
              />
            </span>
            <span>
              <img
                src="https://i5.walmartimages.com/seo/CifToys-Trex-Dinosaur-Toys-for-Kids-3-5-T-Rex-Toy-Realistic-Tyrannosaurus-Rex_847a91dd-8df3-4fae-a2a5-1b266bdfd870.c0bc20b87ca2e6ad8246979ab17342dd.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF"
                alt="toy"
                className="w-20"
              />
            </span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .marquee {
    overflow: hidden;
    width: 100%;
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
  }

  .marquee__inner {
    display: flex;
    width: max-content;
    animation: marquee 20s linear infinite;
  }

  .marquee__group {
    display: flex;
    align-items: center;
  }

  .marquee__group span {
    margin: 0 0.5rem; /* avvalgidan 3x kichik */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .marquee__group img {
    width: 90px;
    height: 90px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .marquee__group img:hover {
    transform: scale(1.1);
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

export default Card;
