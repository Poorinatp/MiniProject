-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 04, 2023 at 06:12 PM
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

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Order_id`, `Product_id`, `Payment_id`, `Color`, `Size`, `Total_Item`, `Created_at`) VALUES
(17844507, 138, 24114, 'white', 'L', 1, '2023-11-03 17:08:41'),
(17844508, 140, 24117, 'white', 'S', 1, '2023-11-03 17:19:50');

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

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`Payment_id`, `User_id`, `Amount`, `Status`) VALUES
(24114, 60011, 140, 'ยังไม่ชำระเงิน'),
(24115, 60011, 140, 'ยังไม่ชำระเงิน'),
(24116, 60011, 140, 'ยังไม่ชำระเงิน'),
(24117, 60011, 140, 'ยังไม่ชำระเงิน');

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
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`Product_id`, `User_id`, `Created_at`, `Description`, `product_image`, `status`) VALUES
(136, 60011, '2023-11-03 16:52:10', 'ผู้หญิงชมดอกไม้', 'shirt-design\\60011_1699030286091.png', 'enable'),
(137, 60011, '2023-11-03 17:10:15', '', 'shirt-design\\60011_1699030737772.png', 'disable'),
(138, 60011, '2023-11-03 17:09:15', 'ผู้หญิงถือของขวัญ', 'shirt-design\\60011_1699031289261.png', 'enable'),
(139, 60011, '2023-11-04 15:42:45', 'ผู้หญิงกับกระเป๋าเดินทาง', 'shirt-design\\60011_1699031639348.png', 'disable'),
(140, 60011, '2023-11-03 17:20:19', 'ผู้หญิงกับกระเป๋าเดินทาง', 'shirt-design\\60011_1699031958011.png', 'enable'),
(142, 60023, '2023-11-04 15:46:45', 'ผู้หญิงวาดรูป', 'shirt-design\\60023_1699111851854.png', 'disable'),
(143, 60023, '2023-11-04 15:41:14', 'ผู้หญิงส่องกระจก', 'shirt-design\\60023_1699111996344.png', 'enable'),
(144, 60023, '2023-11-04 15:41:22', 'ผู้หญิงกับตุ๊กตาหิมะรูปแมว', 'shirt-design\\60023_1699112424306.png', 'enable'),
(145, 60023, '2023-11-04 15:43:27', 'ผู้หญิงวาดรูป', 'shirt-design\\60023_1699112536192.png', 'enable'),
(146, 60023, '2023-11-04 15:48:38', 'ผู้หญิงกับตุ๊กตาหิมะรูปแมว', 'shirt-design\\60023_1699112846664.png', 'disable'),
(147, 60011, '2023-11-04 16:42:04', 'ผู้หญิงส่องกระจก', 'shirt-design\\60011_1699116067554.png', 'enable'),
(148, 60011, '2023-11-04 16:44:32', 'ผู้หญิงกับตุ๊กตาหิมะรูปแมว', 'shirt-design\\60011_1699116249876.png', 'enable');

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
  `text_value` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_detail`
--

INSERT INTO `product_detail` (`id`, `Product_id`, `Font_size`, `Font_family`, `Font_color`, `location_img`, `img_width`, `img`, `location_text`, `text_value`) VALUES
(64, 136, 0, '', '', '79px;-7px', '207.35999999999999px', 'ผู้หญิงชมดอกไม้.png', '', ''),
(68, 138, 26, 'Asap_SemiExpanded-BoldItalic', 'black', '', '', '', '91px;64px', 'lOVE'),
(69, 138, 0, '', '', '128px;46px', '100px', 'ผู้หญิงถือของขวัญ.png', '', ''),
(72, 140, 32, 'Asap-ExtraBold', 'black', '', '', '', '61px;53px', 'Travel'),
(73, 140, 0, '', '', '101px;16px', '207.35999999999999px', 'ผู้หญิงกับกระเป๋าเดินทาง.png', '', ''),
(77, 143, 24, 'Asap_Expanded-ExtraBoldItalic', 'black', '', '', '', '63px;21px', 'I Love '),
(78, 143, 24, 'Asap_Expanded-ExtraBoldItalic', 'black', '', '', '', '97px;74px', 'MYSelf '),
(79, 143, 0, '', '', '165px;70px', '172.79999999999998px', 'ผู้หญิงส่องกระจก.png', '', ''),
(80, 144, 24, 'FiraSansExtraCondensed-BoldItalic', '#7970f5', '', '', '', '118px;81px', 'Your name!!'),
(81, 144, 24, 'FiraSansExtraCondensed-ExtraBoldItalic', '#7970f5', '', '', '', '41px;89px', ' chirstmas '),
(82, 144, 24, 'FiraSansExtraCondensed-SemiBoldItalic', '#7970f5', '', '', '', '81px;147px', 'with  '),
(83, 144, 0, '', '', '198px;83px', '144px', 'ผู้หญิงกับตุ๊กตาหิมะรูปแมว.png', '', ''),
(84, 145, 24, 'Basic-Regular', 'black', '', '', '', '93px;35px', 'Your name'),
(85, 145, 0, '', '', '149px;19px', '172.79999999999998px', 'ผู้หญิงวาดรูป.png', '', ''),
(90, 147, 24, 'Asap_Expanded-ExtraBoldItalic', 'black', '', '', '', '63px;21px', 'I Love '),
(91, 147, 24, 'Asap_Expanded-ExtraBoldItalic', 'black', '', '', '', '97px;74px', 'MYSelf '),
(92, 147, 0, '', '', '165px;70px', '172.79999999999998px', 'ผู้หญิงส่องกระจก.png', '', ''),
(93, 148, 24, 'FiraSansExtraCondensed-BoldItalic', '#7970f5', '', '', '', '101px;123px', 'Poom'),
(94, 148, 24, 'FiraSansExtraCondensed-ExtraBoldItalic', '#7970f5', '', '', '', '41px;89px', ' chirstmas '),
(95, 148, 24, 'FiraSansExtraCondensed-SemiBoldItalic', '#7970f5', '', '', '', '75px;142px', 'with  '),
(96, 148, 0, '', '', '198px;83px', '144px', 'ผู้หญิงกับตุ๊กตาหิมะรูปแมว.png', '', '');

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
  `Telephone` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`User_id`, `Email`, `Password`, `Firstname`, `Lastname`, `Telephone`) VALUES
(60010, 'Poomy5555@hotmail.com', 'Aa55555555', 'ภูริณัฐ', 'ผดุงญาณ', '0897845656'),
(60011, 'buildty10@gmail.com', 'Beauty5888', 'Thanaphon', 'Jomjindarat', '0954543003'),
(60012, 'bestei456@gmail.com', 'Bes1234567', 'Thananan', 'Jomjindarat', '0964004523'),
(60013, 'ningning@gmail.com', 'Nongning55', 'Pimlada', 'wasitsakoon', '0815051140'),
(60014, 'lnwza@hotmail.com', 'Konlnw7891', 'กฤษฎา', 'แก้วมณีเพชร', '0860681163'),
(60015, 'Guntee_2540@hotmail.com', '00000000As', 'Guntawan', 'premsuk', '0909095454'),
(60018, 'bowvy1000@gmail.com', 'AbcDef4567', 'Jaruwan', 'wongsukorn', '0655657841'),
(60019, 'zaza@hotmail.com', 'Zazazaza10', 'ซาซ่า', 'ฉันปวีทนา', '0987566601'),
(60020, 'rasberry171@hotmail.com', 'rasberry17', 'Shrewsbury', 'harvestmoon', '0816547123'),
(60021, 'biggy@gmail.com', 'Biggy78999', 'บิ๊กกี้', 'ฟุ้งฟริ้ง', '0954568700'),
(60022, 'flower@gmail.com', 'Ff11111111', 'ดอกไม้', 'พฤกษา', '0956551232'),
(60023, 'admin@gmail.com', 'Admin12345', 'Admin', '', '');

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
(1, 60011, 'อิสรภาพ 24', 10700, 'กทม.', 'ประเทศไทย'),
(2, 60012, 'หมู่ 6 ถนนพระราม2 ตำบลพันท้ายนรสิงห์ ', 47000, 'สมุทรสาคร', 'ประเทศไทย'),
(3, 60014, '14/28 ถนนเจริญกรุง เขตสัมพันธวงศ์ ', 10100, 'กทม.', 'ไทย'),
(4, 60013, 'อาคารณัฐภูมิ ชั้น 4 ถนนเจริญกรุง', 10100, 'กทม', 'ไทย'),
(5, 60015, '741 ถ.แม่ริม - สันทราย ม.8 ต.ริมใต้ อ.แม่ริม', 50180, 'จ.เชียงใหม่', 'ประเทศไทย'),
(113, 60018, '27 ถนนดินสอ แขวงเสาชิงช้า เขตพระนคร ', 10100, 'กทม', 'Thailand'),
(114, 60019, '29/1 ปากน้ำ อำเภอเมือง', 12000, 'สมุทรปราการ', 'Thailand'),
(115, 60020, '74/15 เขตพระนคร แขวงสวนหลวง', 11000, 'กรุงเทพ', 'ไทย'),
(116, 60021, '47-123 หมู่ที่ 1 ถนนเชียงใหม่-ฝาง ตำบลริมใต้ อำเภอแม่ริม', 50180, 'chingmai', 'Thailand'),
(117, 60022, '6/22 ถนนดอกไม้', 12000, 'กรุงเทพ', 'ประเทศไทย');

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
  MODIFY `Order_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17844509;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `Payment_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24118;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `Product_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `product_detail`
--
ALTER TABLE `product_detail`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `User_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60024;

--
-- AUTO_INCREMENT for table `user_address`
--
ALTER TABLE `user_address`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

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
