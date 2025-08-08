import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Layout/RootLayout";
import Home from "./pages/Home";
import ProductFarm from "./pages/ProductFarm";
import AdminLayout from "./Layout/AdminLayout";
import DashBoard from "./admin/pages/DashBoard";
import UserController from "./admin/pages/UserController";
import LoginAdmin from "./admin/pages/LoginAdmin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GuildBookController from "./admin/pages/GuildBookController";
import PostController from "./admin/pages/PostController";
import PostReportController from "./admin/pages/PostReportController";
import ReportAnimals from "./admin/pages/ReportAnimals";
import ReportProducts from "./admin/pages/ReportProducts";
import AddGuileBook from "./admin/From/AddGuileBook";
import CommentReport from "./admin/pages/CommentReport";
import FarmPage from "./pages/FarmList";
import GuildBook from "./pages/GuildBook";
import Price from "./pages/Price";
import FarmLayout from "./Layout/FarmLayout";
import Profile from "./Farm/pages/Profile";
import Logs from "./Farm/pages/Logs";
import News from "./Farm/pages/News";
import Comunity from "./Farm/pages/Comunity";
import Product from "./Farm/pages/Product";
import Animal from "./Farm/pages/Animal";
import FarmProfile from "./pages/FarmProfile";
import ForGotPass from "./pages/ForGotPass";
import BookDetail from "./pages/BookDetail";
import AnimalRequest from "./admin/pages/AnimalRequest";
import AnimalTypeRequest from "./admin/pages/AnimalTypeRequest";
import AnimalAll from "./admin/pages/AnimalAll";
import AnimalTypeAll from "./admin/pages/AnimalTypeAll";
import AnimalReq from "./Farm/pages/AnimalReq";
import AnimalTypeReq from "./Farm/pages/AnimalTypeReq";
import CategoryController from "./admin/pages/CategoryController";
import ForGotPassAdmin from "./admin/pages/forGotPassword";
import { SummaryCountProvider } from "./admin/components/SummaryCountContext";
import Newslist from "./pages/Newslist";
import AddNews from "./Farm/pages/AddNews";
import AddNewsAdmin from "./admin/pages/AddNews.jsx";
import NewTest from "./newtest.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import GuildBookContro from "./admin/pages/GuildBookContro.jsx";
import EditGuildBook from "./admin/pages/EditGuildBook.jsx";
import HistoryPostReport from "./Farm/pages/HistoryPostReport.jsx";
import HistoryCommentReport from "./Farm/pages/HistoryCommentReport.jsx";
import NewsHistory from "./admin/pages/NewsHistory.jsx";
import FarmNewsHistory from "./Farm/pages/NewsHistory.jsx";
import EditNews from "./admin/pages/EditNews.jsx";
import FarmEditNews from "./Farm/pages/EditNews.jsx";

function App() {
  const router = createBrowserRouter([
    { path: "/admin/reset_password", element: <ForGotPassAdmin /> },
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "product", element: <ProductFarm /> },
        { path: "farmList", element: <FarmPage /> },
        { path: "book", element: <GuildBook /> },
        { path: "book/:id", element: <BookDetail /> },
        { path: "price", element: <Price /> },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "farm/:id",
          element: <FarmProfile />,
        },
        {
          path: "news",
          element: <Newslist />,
        },
        {
          path: "forgot_password",
          element: <ForGotPass />,
        },
        {
          path: "news/detail/:id",
          element: <NewsDetail />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { path: "/admin/dashBoard", element: <DashBoard /> },
        { path: "/admin/user", element: <UserController /> },
        {
          path: "/admin/farm/:id",
          element: <FarmProfile />,
        },
        {
          path: "/admin/book",
          element: <GuildBookController />,
        },
        { path: "/admin/post", element: <PostController /> },
        { path: "/admin/report_post", element: <PostReportController /> },
        { path: "/admin/news", element: <News /> },
        { path: "/admin/news/detail/:id", element: <NewsDetail /> },
        { path: "/admin/news/insert", element: <AddNewsAdmin /> },
        { path: "/admin/report_animal", element: <ReportAnimals /> },
        { path: "/admin/report_product", element: <ReportProducts /> },
        { path: "/admin/book/add_guild_book", element: <GuildBookContro /> },
        { path: "/admin/book/edit/:id", element: <EditGuildBook /> },
        { path: "/admin/comment_report", element: <CommentReport /> },
        { path: "/admin/animal_request", element: <AnimalRequest /> },
        { path: "/admin/animal_type_request", element: <AnimalTypeRequest /> },
        { path: "/admin/animal_all", element: <AnimalAll /> },
        { path: "/admin/animal_type_all", element: <AnimalTypeAll /> },
        { path: "/admin/category", element: <CategoryController /> },
        { path: "/admin/news-history", element: <NewsHistory /> },
        { path: "/admin/edit-news/:id", element: <EditNews /> },
      ],
    },
    {
      path: "/profile",
      element: <FarmLayout />,
      children: [
        { path: "/profile", element: <Profile /> },
        {
          path: "/profile/farm/:id",
          element: <FarmProfile />,
        },
        { path: "/profile/product", element: <Product /> },
        { path: "/profile/animal", element: <Animal /> },
        { path: "/profile/animal/request", element: <AnimalReq /> },
        { path: "/profile/animal-type/request", element: <AnimalTypeReq /> },
        { path: "/profile/social", element: <Comunity /> },
        { path: "/profile/news", element: <News /> },
        { path: "/profile/news/insert", element: <AddNews /> },
        { path: "/profile/news/detail/:id", element: <NewsDetail /> },
        { path: "/profile/logs", element: <Logs /> },
        { path: "/profile/report/post", element: <HistoryPostReport /> },
        { path: "/profile/report/comment", element: <HistoryCommentReport /> },
        { path: "/profile/news-history", element: <FarmNewsHistory /> },
        { path: "/profile/edit-news/:id", element: <FarmEditNews /> },
      ],
    },
    {
      path: "admin/login",
      element: <LoginAdmin />,
    },
  ]);
  return (
    <SummaryCountProvider>
      <RouterProvider router={router} />
    </SummaryCountProvider>
  );
}

export default App;
