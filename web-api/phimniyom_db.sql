-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 03, 2023 at 06:48 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `phimniyom_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Order_id` int(10) NOT NULL,
  `Product_id` int(10) NOT NULL,
  `Payment_id` int(8) NOT NULL,
  `Color` text NOT NULL,
  `Size` text NOT NULL,
  `Total_Item` int(255) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `Payment_id` int(8) NOT NULL,
  `User_id` int(10) NOT NULL,
  `Amount` int(255) NOT NULL,
  `Status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `Product_id` int(10) NOT NULL,
  `User_id` int(10) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Description` text NOT NULL,
  `product_image` text NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_detail`
--

CREATE TABLE `product_detail` (
  `id` int(10) NOT NULL,
  `Product_id` int(10) NOT NULL,
  `Font_size` int(10) NOT NULL,
  `Font_family` varchar(100) NOT NULL,
  `Font_color` varchar(80) NOT NULL,
  `location_img` text NOT NULL,
  `img_width` varchar(1000) NOT NULL,
  `img` varchar(1000) NOT NULL,
  `location_text` text NOT NULL,
  `text_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `User_id` int(10) NOT NULL,
  `Email` text NOT NULL,
  `Password` varchar(10) NOT NULL,
  `Firstname` text NOT NULL,
  `Lastname` text NOT NULL,
  `Telephone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`User_id`, `Email`, `Password`, `Firstname`, `Lastname`, `Telephone`) VALUES
(60010, 'Poomy5555@hotmail.com', 'Aa55555555', 'ภูริณัฐ', 'ผดุงญาณ', '0897845656'),
(60011, 'buildty10@gmail.com', 'beauty5888', 'Thanaphon', 'Jomjindarat', '954543003'),
(60012, 'bestei456@gmail.com', 'Bes1234567', 'Thananan', 'Jomjindarat', '964004523'),
(60013, 'ningning@gmail.com', 'Nongning55', 'Pimlada', 'wasitsakoon', '815051140'),
(60014, 'lnwza@hotmail.com', 'Konlnw7891', 'กฤษฎา', 'แก้วมณีเพชร', '860681163'),
(60015, 'Guntee_2540@hotmail.com', '00000000As', 'Guntawan', 'premsuk', '909095454'),
(60018, 'bowvy1000@gmail.com', 'AbcDef4567', 'Jaruwan', 'wongsukorn', '655657841'),
(60019, 'zaza@hotmail.com', 'Zazazaza10', 'ซาซ่า', 'ฉันปวีทนา', '987566601'),
(60020, 'rasberry171@hotmail.com', 'rasberry17', 'Shrewsbury', 'harvestmoon', '816547123'),
(60021, 'biggy@gmail.com', 'Biggy78999', 'บิ๊กกี้', 'ฟุ้งฟริ้ง', '954568700'),
(60022, 'maylada@hotmail.com', 'As77777777', 'maylada', 'alexander', '90'),
(60023, 'maylada@hotmail.com', 'Aa55555555', 'maylada', 'alexander', '090-888-10'),
(60024, 'sandara@gmail.com', 'Aw55555555', 'sandara', 'park', '0878780030');

-- --------------------------------------------------------

--
-- Table structure for table `user_address`
--

CREATE TABLE `user_address` (
  `id` int(10) NOT NULL,
  `User_id` int(10) NOT NULL,
  `Address` text NOT NULL,
  `Zipcode` int(5) NOT NULL,
  `City` varchar(100) NOT NULL,
  `Country` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_address`
--

INSERT INTO `user_address` (`id`, `User_id`, `Address`, `Zipcode`, `City`, `Country`) VALUES
(0, 60010, 'ลาดพร้าว 71 ', 10300, 'กทม.', 'ประเทศไทย'),
(1, 60011, 'อิสรภาพ 24', 10500, 'กทม.', 'ประเทศไทย'),
(2, 60012, 'หมู่ 6 ถนนพระราม2 ตำบลพันท้ายนรสิงห์ ', 47000, 'สมุทรสาคร', 'ประเทศไทย'),
(3, 60014, '14/28 ถนนเจริญกรุง เขตสัมพันธวงศ์ ', 10100, 'กทม.', 'ไทย'),
(4, 60013, 'อาคารณัฐภูมิ ชั้น 4 ถนนเจริญกรุง', 10100, 'กทม', 'ไทย'),
(5, 60015, '741 ถ.แม่ริม - สันทราย ม.8 ต.ริมใต้ อ.แม่ริม', 50180, 'จ.เชียงใหม่', 'ประเทศไทย'),
(113, 60018, '27 ถนนดินสอ แขวงเสาชิงช้า เขตพระนคร ', 10100, 'กทม', 'Thailand'),
(114, 60019, '29/1 ปากน้ำ อำเภอเมือง', 12000, 'สมุทรปราการ', 'Thailand'),
(115, 60020, '74/15 เขตพระนคร แขวงสวนหลวง', 11000, 'กรุงเทพ', 'ไทย'),
(116, 60021, '47-123 หมู่ที่ 1 ถนนเชียงใหม่-ฝาง ตำบลริมใต้ อำเภอแม่ริม', 50180, 'chingmai', 'Thailand'),
(117, 60022, '47/8', 10150, 'บางรัก', 'กทม'),
(118, 60023, '41/88', 10150, 'บางรัก', 'Thailand'),
(119, 60024, '125', 14555, 'korat', 'Tha');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_id`),
  ADD KEY `Payment_id` (`Payment_id`),
  ADD KEY `Product_id` (`Product_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`Payment_id`),
  ADD KEY `User_id` (`User_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`Product_id`),
  ADD KEY `User_id` (`User_id`);

--
-- Indexes for table `product_detail`
--
ALTER TABLE `product_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_id` (`Product_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_id`);

--
-- Indexes for table `user_address`
--
ALTER TABLE `user_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `User_id` (`User_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Order_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17844514;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `Payment_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24120;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `Product_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `product_detail`
--
ALTER TABLE `product_detail`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `User_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60025;

--
-- AUTO_INCREMENT for table `user_address`
--
ALTER TABLE `user_address`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`Payment_id`) REFERENCES `payment` (`Payment_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`Product_id`) REFERENCES `product` (`Product_id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `user` (`User_id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `user` (`User_id`);

--
-- Constraints for table `product_detail`
--
ALTER TABLE `product_detail`
  ADD CONSTRAINT `product_detail_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `product` (`Product_id`);

--
-- Constraints for table `user_address`
--
ALTER TABLE `user_address`
  ADD CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `user` (`User_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
