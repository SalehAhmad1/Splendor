import { Carousel } from "flowbite-react";
import pic1 from "../../public/pic1.png";
import pic2 from "../../public/pic2.png";
import pic3 from "../../public/pic2.png";
import pic4 from "../../public/pic1.png";
import pic5 from "../../public/pic1.png";

export default function myCarousel() {
  return (
    <div className="h-56 sm:h-64 md:h-96">
      <Carousel pauseOnHover>
        <img src={pic1.src} alt="..." />
        <img src={pic2.src} alt="..." />
        <img src={pic3.src} alt="..." />
        <img src={pic4.src} alt="..." />
        <img src={pic5.src} alt="..." />
      </Carousel>
      
    </div>
  );
}
