import { Outlet } from "react-router-dom";
import Header from "./component/Header";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { setDataProduct } from "./redux/productSlide";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/product`);
        const resData = await res.json();

        if (res.ok) {
          dispatch(setDataProduct(resData));
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to fetch product data.");
      }
    };

    fetchProductData();
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div>
        <Header />
        <main className="pt-16 bg-slate-100 min-h-[100vh]">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
