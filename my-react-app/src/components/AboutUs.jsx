// src/pages/AboutUs.jsx
import React, { useEffect } from "react";
import "./about.css"; 

export default function AboutUs() {
  useEffect(() => {
    const fok = () => {
      document.getElementById("arr").style.backgroundImage =
        "url(https://cdn.iconscout.com/icon/premium/png-64-thumb/chevron-arrow-3883460-3231250.png)";
    };
    const kof = () => {
      document.getElementById("arr").style.backgroundImage =
        "url(https://cdn.iconscout.com/icon/free/png-64/right-arrow-1438234-1216195.png)";
    };
    const gok = () => {
      document.getElementById("brr").style.backgroundImage =
        "url(https://cdn.iconscout.com/icon/premium/png-64-thumb/chevron-arrow-3883460-3231250.png)";
    };
    const kog = () => {
      document.getElementById("brr").style.backgroundImage =
        "url(https://cdn.iconscout.com/icon/free/png-64/right-arrow-1438234-1216195.png)";
    };
    const hok = () => {
      document.getElementById("crr").style.backgroundImage =
        "url(https://cdn.iconscout.com/icon/premium/png-64-thumb/chevron-arrow-3883460-3231250.png)";
    };
    const koh = () => {
      document.getElementById("crr").style.backgroundImage =
        "url(https://cdn.iconscout.com/icon/free/png-64/right-arrow-1438234-1216195.png)";
    };

    window.onscroll = () => {
      const ilake = document.getElementById("head");
      ilake.style.top = "0px";
      ilake.style.position = "sticky";
    };

    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
          reveals[i].classList.add("active");
        } else {
          reveals[i].classList.remove("active");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="App">
      {/* nội dung bạn dán từ <nav> đến </footer> */}
      {/* Dài nên không lặp lại ở đây */}
    </div>
  );
}
