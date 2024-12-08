-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2024 at 12:56 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `financialapp`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `account`
--

CREATE TABLE `account` (
  `Id` int(11) NOT NULL,
  `Code` int(11) NOT NULL,
  `Active` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Balance` float NOT NULL,
  `IconId` int(11) NOT NULL,
  `Color` varchar(20) NOT NULL,
  `Status` int(11) NOT NULL COMMENT '0-nieliczone, 1-normalne konto, 2-dziesiecina, 3-obligacje',
  `GroupsId` int(11) NOT NULL,
  `UpdateDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`Id`, `Code`, `Active`, `Name`, `Balance`, `IconId`, `Color`, `Status`, `GroupsId`, `UpdateDate`) VALUES
(37, 1, 0, 'Kamil', 99, 2, 'rgb(45,228,155)', 0, 9, '2024-10-01'),
(38, 2, 0, 'Justyna', 99, 5, 'rgb(32,12,255)', 1, 9, '2024-10-01'),
(39, 3, 0, 'Gotówka', 26, 4, 'rgb(123,123,123)', 1, 9, '2024-10-03'),
(40, 4, 0, 'Dziesięcina', 99, 1, 'rgb(45,222,12)', 2, 9, '2024-10-14'),
(41, 5, 1, 'Obligacje', 99, 3, 'rgb(255,155,12)', 3, 9, '2024-10-07'),
(50, 6, 0, 'Testowe', 99, 1, 'rgb(30,213,106)', 1, 9, '2024-10-18'),
(51, 6, 0, 'Testowe', 59, 1, 'rgb(30,213,106)', 1, 9, '2024-10-18'),
(52, 6, 0, 'Testowe', 99, 1, 'rgb(30,213,106)', 1, 9, '2024-10-18'),
(53, 6, 0, 'Testowe', 99, 1, 'rgb(30,213,106)', 0, 9, '2024-10-18'),
(54, 7, 0, 'Test', 99, 1, 'rgb(255,20,201)', 1, 9, '2024-10-18'),
(55, 7, 0, 'Test', 99, 1, 'rgb(255,20,201)', 0, 9, '2024-10-18'),
(56, 7, 0, 'Test', 10, 1, 'rgb(255,234,201)', 1, 9, '2024-10-18'),
(57, 7, 0, 'Test', 10, 1, 'rgb(255,52,201)', 1, 9, '2024-10-18'),
(58, 8, 0, 'Test2', 99, 4, 'rgb(123,123,33)', 1, 9, '2024-10-18'),
(59, 8, 0, 'Test2', 99, 1, 'rgb(123,123,33)', 0, 9, '2024-10-18'),
(60, 1, 0, 'Kamil', 99, 2, 'rgb(45,228,155)', 0, 9, '2024-10-19'),
(61, 2, 0, 'Justyna', 99, 5, 'rgb(32,12,255)', 1, 9, '2024-10-19'),
(62, 1, 0, 'Kamil', 99, 2, 'rgb(45,228,155)', 0, 9, '2024-11-03'),
(63, 3, 0, 'Gotówka', 51, 4, 'rgb(123,123,123)', 1, 9, '2024-11-03'),
(64, 1, 0, 'Kamil', 99, 2, 'rgb(45,228,155)', 0, 9, '2024-11-03'),
(65, 3, 0, 'Gotówka', 76, 4, 'rgb(123,123,123)', 1, 9, '2024-11-03'),
(66, 1, 0, 'Kamil', 99, 2, 'rgb(45,228,155)', 0, 9, '2024-11-03'),
(67, 3, 0, 'Gotówka', 99, 4, 'rgb(123,123,123)', 1, 9, '2024-11-03'),
(68, 8, 0, 'Test2', 1, 1, 'rgb(123,123,33)', 0, 9, '2024-11-03'),
(69, 2, 0, 'Justyna', 99, 5, 'rgb(32,12,255)', 1, 9, '2024-11-03'),
(70, 2, 0, 'Justyna', 48.01, 5, 'rgb(32,12,255)', 1, 9, '2024-11-03'),
(71, 1, 0, 'Kamil', 149.99, 2, 'rgb(45,228,155)', 0, 9, '2024-11-03'),
(72, 3, 0, 'Gotówka', 40.8, 4, 'rgb(123,123,123)', 1, 9, '2024-11-03'),
(73, 8, 0, 'Test2', 59.2, 1, 'rgb(123,123,33)', 0, 9, '2024-11-03'),
(74, 7, 0, 'Test', 4.5, 1, 'rgb(255,52,201)', 1, 9, '2024-11-03'),
(75, 2, 0, 'Justyna', 53.51, 5, 'rgb(32,12,255)', 1, 9, '2024-11-03'),
(76, 6, 0, 'Testowe', 90.46, 1, 'rgb(30,213,106)', 0, 9, '2024-11-03'),
(77, 7, 0, 'Test', 13.04, 1, 'rgb(255,52,201)', 1, 9, '2024-11-03'),
(78, 2, 0, 'Justyna', 27.66, 5, 'rgb(32,12,255)', 1, 9, '2024-11-02'),
(79, 3, 0, 'Gotówka', 15.8, 4, 'rgb(123,123,123)', 1, 9, '2024-11-02'),
(80, 8, 0, 'Test2', 50, 1, 'rgb(123,123,33)', 0, 9, '2024-11-03'),
(81, 6, 0, 'Testowe', 99.66, 1, 'rgb(30,213,106)', 0, 9, '2024-11-03'),
(82, 7, 0, 'Test', 0.04, 1, 'rgb(255,52,201)', 1, 9, '2024-11-04'),
(83, 2, 0, 'Justyna', 40.66, 5, 'rgb(32,12,255)', 1, 9, '2024-11-04'),
(84, 3, 0, 'Gotówka', 15, 4, 'rgb(123,123,123)', 1, 9, '2024-11-04'),
(85, 7, 0, 'Test', 0.84, 1, 'rgb(255,52,201)', 1, 9, '2024-11-04'),
(86, 3, 0, 'Gotówka', 73.2, 4, 'rgb(123,123,123)', 1, 9, '2024-11-04'),
(87, 8, 0, 'Test2', -8.2, 1, 'rgb(123,123,33)', 0, 9, '2024-11-04'),
(88, 3, 0, 'Gotówka', 27.4, 4, 'rgb(123,123,123)', 1, 9, '2024-11-04'),
(89, 8, 0, 'Test2', 37.6, 1, 'rgb(123,123,33)', 0, 9, '2024-11-04'),
(90, 3, 0, 'Gotówka', 28.2, 4, 'rgb(123,123,123)', 1, 9, '2024-11-04'),
(91, 7, 0, 'Test', 0.04, 1, 'rgb(255,52,201)', 1, 9, '2024-11-04'),
(92, 1, 0, 'Kamil', 174.99, 2, 'rgb(45,228,155)', 0, 9, '2024-11-04'),
(93, 3, 0, 'Gotówka', 3.2, 4, 'rgb(123,123,123)', 1, 9, '2024-11-04'),
(94, 8, 0, 'Test2', 87.6, 1, 'rgb(123,123,33)', 0, 9, '2024-11-04'),
(95, 2, 0, 'Justyna', 50.34, 5, 'rgb(32,12,255)', 1, 9, '2024-11-04'),
(96, 8, 0, 'Test2', 97.6, 1, 'rgb(123,123,33)', 0, 9, '2024-11-04'),
(97, 2, 0, 'Justyna', 40.34, 5, 'rgb(32,12,255)', 1, 9, '2024-11-04'),
(98, 8, 0, 'Test2', 107.6, 1, 'rgb(123,123,33)', 0, 9, '2024-11-04'),
(99, 2, 0, 'Justyna', 30.34, 5, 'rgb(32,12,255)', 1, 9, '2024-11-04'),
(100, 1, 0, 'Kamil', 164.99, 2, 'rgb(45,228,155)', 0, 9, '2024-11-04'),
(101, 7, 0, 'Test', 10.04, 1, 'rgb(255,52,201)', 1, 9, '2024-11-04'),
(102, 1, 0, 'Kamil', 169.99, 2, 'rgb(45,228,155)', 0, 9, '2024-11-04'),
(103, 7, 0, 'Test', 5.04, 1, 'rgb(255,52,201)', 1, 9, '2024-11-04'),
(104, 1, 0, 'Kamil', 164.99, 2, 'rgb(45,228,155)', 0, 9, '2024-11-04'),
(105, 7, 0, 'Test', 10.04, 1, 'rgb(255,52,201)', 1, 9, '2024-11-04'),
(106, 2, 0, 'Justyna', 81.33, 5, 'rgb(32,12,255)', 1, 9, '2024-11-04'),
(107, 1, 0, 'Kamil', 114, 2, 'rgb(45,228,155)', 0, 9, '2024-11-04'),
(108, 6, 0, 'Testowe', 99.66, 1, 'rgb(30,213,106)', 1, 9, '2024-11-04'),
(109, 6, 0, 'Testowe', 99.66, 1, 'rgb(30,213,106)', 0, 9, '2024-11-04'),
(110, 7, 0, 'Test', -14.96, 1, 'rgb(255,52,201)', 1, 9, '2024-12-03'),
(111, 8, 0, 'Test2', 7.6, 1, 'rgb(123,123,33)', 0, 9, '2024-12-01'),
(112, 2, 0, 'Justyna', 66.33, 5, 'rgb(32,12,255)', 1, 9, '2024-12-03'),
(113, 1, 0, 'Kamil', 89, 2, 'rgb(45,228,155)', 0, 9, '2024-12-02'),
(114, 6, 0, 'Testowe', 149.66, 1, 'rgb(30,213,106)', 0, 9, '2024-12-02'),
(115, 7, 0, 'Test', 0.04, 1, 'rgb(255,52,201)', 1, 9, '2024-12-04'),
(116, 7, 0, 'Test', 10.04, 1, 'rgb(255,52,201)', 1, 9, '2024-12-01'),
(117, 3, 0, 'Gotówka', 53.2, 4, 'rgb(123,123,123)', 1, 9, '2024-12-03'),
(118, 7, 0, 'Test', 11.04, 1, 'rgb(255,52,201)', 1, 9, '2024-12-04'),
(119, 2, 0, 'Justyna', 115.33, 5, 'rgb(32,12,255)', 1, 9, '2024-12-04'),
(120, 7, 0, 'Test', 21.04, 1, 'rgb(255,52,201)', 1, 9, '2024-12-03'),
(121, 1, 0, 'Kamil', 99, 2, 'rgb(45,228,155)', 0, 9, '2024-12-02'),
(122, 1, 0, 'Kamil', 99, 1, 'rgb(45,228,155)', 1, 9, '2024-12-07'),
(123, 1, 0, 'Kamil', 119, 1, 'rgb(45,228,155)', 1, 9, '2024-12-03'),
(124, 7, 0, 'Test', 11.04, 1, 'rgb(255,52,201)', 1, 9, '2024-12-03'),
(125, 2, 0, 'Justyna', 65.33, 5, 'rgb(32,12,255)', 1, 9, '2024-12-04'),
(126, 1, 0, 'Kamil', 179, 1, 'rgb(45,228,155)', 1, 9, '2024-12-04'),
(127, 1, 0, 'Kamil', 119, 1, 'rgb(45,228,155)', 1, 9, '2024-12-04'),
(128, 2, 0, 'Justyna', 115.34, 5, 'rgb(32,12,255)', 1, 9, '2024-12-04'),
(129, 7, 0, 'Test', 21.04, 1, 'rgb(255,52,201)', 1, 9, '2024-12-03'),
(130, 2, 0, 'Justyna', 85.34, 5, 'rgb(32,12,255)', 1, 9, '2024-12-03'),
(131, 7, 0, 'Test', 41.04, 1, 'rgb(255,52,201)', 1, 9, '2024-12-03'),
(132, 8, 1, 'Test2', -12.4, 1, 'rgb(123,123,33)', 0, 9, '2024-12-03'),
(133, 7, 0, 'Test', 61.04, 1, 'rgb(255,52,201)', 1, 9, '2024-12-03'),
(134, 3, 0, 'Gotówka', 33.2, 4, 'rgb(123,123,123)', 1, 9, '2024-12-03'),
(135, 3, 0, 'Gotówka', 53.2, 4, 'rgb(123,123,123)', 1, 9, '2024-12-03'),
(136, 1, 0, 'Kamil', 93.47, 1, 'rgb(45,228,155)', 1, 9, '2024-12-03'),
(137, 1, 0, 'Kamil', 119, 1, 'rgb(45,228,155)', 1, 9, '2024-12-03'),
(138, 3, 0, 'Gotówka', 27.68, 4, 'rgb(123,123,123)', 1, 9, '2024-12-03'),
(139, 3, 1, 'Gotówka', 53.2, 4, 'rgb(123,123,123)', 1, 9, '2024-12-03'),
(140, 1, 0, 'Kamil', 93.48, 1, 'rgb(45,228,155)', 1, 9, '2024-12-03'),
(141, 1, 1, 'Kamil', 119, 1, 'rgb(45,228,155)', 1, 9, '2024-12-03'),
(142, 7, 1, 'Test', 19.7, 1, 'rgb(255,52,201)', 1, 9, '2024-12-03'),
(143, 2, 0, 'Justyna', 84.84, 5, 'rgb(32,12,255)', 1, 9, '2024-12-08'),
(144, 4, 0, 'Dziesięcina', 99.5, 1, 'rgb(45,222,12)', 2, 9, '2024-12-08'),
(145, 6, 1, 'Testowe', 136.66, 1, 'rgb(30,213,106)', 0, 9, '2024-12-08'),
(146, 4, 0, 'Dziesięcina', 112.5, 1, 'rgb(45,222,12)', 2, 9, '2024-12-08'),
(147, 2, 0, 'Justyna', 84.72, 5, 'rgb(32,12,255)', 1, 9, '2024-12-08'),
(148, 4, 0, 'Dziesięcina', 112.62, 1, 'rgb(45,222,12)', 2, 9, '2024-12-08'),
(149, 2, 0, 'Justyna', 84.71, 5, 'rgb(32,12,255)', 1, 9, '2024-12-08'),
(150, 4, 0, 'Dziesięcina', 112.63, 1, 'rgb(45,222,12)', 2, 9, '2024-12-08'),
(151, 2, 1, 'Justyna', 84.7, 5, 'rgb(32,12,255)', 1, 9, '2024-12-08'),
(152, 4, 1, 'Dziesięcina', 112.64, 1, 'rgb(45,222,12)', 2, 9, '2024-12-08');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `category`
--

CREATE TABLE `category` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Type` int(11) NOT NULL,
  `Planned` float DEFAULT NULL,
  `IconId` int(11) NOT NULL,
  `Color` varchar(20) NOT NULL,
  `GroupsId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`Id`, `Name`, `Type`, `Planned`, `IconId`, `Color`, `GroupsId`) VALUES
(1, 'Artykuły spożywcze', 1, NULL, 1, 'rgb(127,79,178)', NULL),
(2, 'Dom', 1, NULL, 2, 'rgb(64,174,255)', NULL),
(3, 'Inne', 1, NULL, 3, 'rgb(225,96,96)', NULL),
(4, 'Sport', 1, NULL, 4, 'rgb(180,110,254)', NULL),
(5, 'Podróże', 1, NULL, 5, 'rgb(217,122,122)', NULL),
(6, 'Praca', 2, NULL, 2, 'rgb(32,33,123)', NULL),
(7, 'Od Rodziny', 2, NULL, 3, 'rgb(123,11,183)', NULL),
(8, 'Zachcianki', 1, NULL, 3, 'rgb(123,123,123)', NULL),
(9, 'Moda', 1, NULL, 2, 'rgb(234,234,234)', NULL),
(10, 'Uroda', 1, NULL, 1, 'rgb(45,228,155)', NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `finance`
--

CREATE TABLE `finance` (
  `Id` int(11) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `AccountCode` int(11) NOT NULL,
  `Amount` float NOT NULL,
  `Date` date NOT NULL,
  `Description` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `finance`
--

INSERT INTO `finance` (`Id`, `CategoryId`, `AccountCode`, `Amount`, `Date`, `Description`) VALUES
(35, 2, 2, 25.85, '2024-11-02', 'Test'),
(36, 3, 3, 25, '2024-11-02', 'Test'),
(37, 5, 7, 26.34, '2024-12-03', 'Test'),
(38, 9, 8, 100, '2024-12-02', 'HD12'),
(39, 4, 2, 15.55, '2024-12-03', 'Bronx'),
(41, 3, 3, 50, '2024-11-30', 'Test 123'),
(42, 7, 6, 50, '2024-12-02', 'Starówka'),
(44, 6, 7, 10, '2024-12-01', 'Dodaje'),
(45, 7, 3, 50, '2024-12-03', 'Rodzina'),
(46, 6, 7, 1, '2024-12-04', 'Dodaje złotówkę'),
(47, 7, 2, 20.25, '2024-12-04', 'Te'),
(48, 6, 7, 5, '2024-12-03', 'Cc');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `groups`
--

CREATE TABLE `groups` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Code` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`Id`, `Name`, `Code`) VALUES
(9, 'Prywatne', 'Je9lei'),
(10, 'TEST', 'sdfsdf'),
(11, 'Moja testowa', 'Fy8s56');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `icon`
--

CREATE TABLE `icon` (
  `Id` int(11) NOT NULL,
  `Type` int(11) NOT NULL,
  `Picture` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `icon`
--

INSERT INTO `icon` (`Id`, `Type`, `Picture`) VALUES
(1, 0, 'shop.png'),
(2, 1, 'home.png'),
(3, 2, 'question.png'),
(4, 3, 'strength.png'),
(5, 4, 'map.png');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `icontype`
--

CREATE TABLE `icontype` (
  `Id` int(11) NOT NULL,
  `NamePL` varchar(50) NOT NULL,
  `NameEN` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `icontype`
--

INSERT INTO `icontype` (`Id`, `NamePL`, `NameEN`) VALUES
(0, 'Dom', 'Home'),
(1, 'Zakupy', 'Shop'),
(2, 'Inne', 'Other'),
(3, 'Sport', 'Sport'),
(4, 'Podróże', 'Travel');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `planning`
--

CREATE TABLE `planning` (
  `Id` int(11) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `Date` date NOT NULL,
  `PlannedAmount` float NOT NULL,
  `GroupsId` int(11) NOT NULL,
  `Status` int(11) NOT NULL COMMENT '0 - Nie zatwierdzone, 1 - zatwierdzone, 2 - zamknięte'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `planning`
--

INSERT INTO `planning` (`Id`, `CategoryId`, `Date`, `PlannedAmount`, `GroupsId`, `Status`) VALUES
(34, 1, '2024-10-19', 200, 9, 2),
(35, 6, '2024-11-03', 2000, 9, 2),
(36, 2, '2024-11-03', 1000, 9, 2),
(45, 6, '2024-12-04', 5, 9, 1),
(46, 3, '2024-12-04', 258, 9, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `sessions`
--

CREATE TABLE `sessions` (
  `Id` int(11) NOT NULL,
  `UsersId` int(11) NOT NULL,
  `Date` datetime NOT NULL,
  `SessionKey` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`Id`, `UsersId`, `Date`, `SessionKey`) VALUES
(1750, 38, '2024-12-08 12:53:29', 'rgkcwLv9f4nGKaB');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `transfer`
--

CREATE TABLE `transfer` (
  `Id` int(11) NOT NULL,
  `FromAccountCode` int(11) NOT NULL,
  `ToAccountCode` int(11) NOT NULL,
  `Amount` float NOT NULL,
  `Date` date NOT NULL,
  `Description` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `transfer`
--

INSERT INTO `transfer` (`Id`, `FromAccountCode`, `ToAccountCode`, `Amount`, `Date`, `Description`) VALUES
(7, 8, 2, 90, '2024-11-04', 'Testowa'),
(10, 7, 2, 5.5, '2024-11-01', 'Test5'),
(11, 6, 7, 8.54, '2024-11-01', 'Test6'),
(12, 8, 6, 9.2, '2024-11-01', 'Test'),
(13, 7, 2, 13, '2024-11-03', 'Przelew'),
(15, 3, 8, 45.8, '2024-11-01', 'Poprawka'),
(17, 1, 7, 10, '2024-11-02', 'Dyszka'),
(18, 2, 4, 0.5, '2024-12-08', 'Wyrównanie'),
(19, 6, 4, 13, '2024-12-08', 'Test'),
(20, 2, 4, 0.12, '2024-12-07', 'Just'),
(21, 2, 4, 0.01, '2024-12-08', 'Taxi');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Login` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Surname` varchar(50) NOT NULL,
  `GroupsId` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Login`, `Password`, `Name`, `Surname`, `GroupsId`) VALUES
(38, 'JustynaG', '7fc56270e7a70fa81a5935b72eacbe29', 'Justyna', 'Gębołyś', '9,10,11');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IconId` (`IconId`),
  ADD KEY `GroupsId` (`GroupsId`);

--
-- Indeksy dla tabeli `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `finance`
--
ALTER TABLE `finance`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `icon`
--
ALTER TABLE `icon`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `icontype`
--
ALTER TABLE `icontype`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `planning`
--
ALTER TABLE `planning`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `CategoryId` (`CategoryId`),
  ADD KEY `GroupsId` (`GroupsId`);

--
-- Indeksy dla tabeli `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `UsersId` (`UsersId`);

--
-- Indeksy dla tabeli `transfer`
--
ALTER TABLE `transfer`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `finance`
--
ALTER TABLE `finance`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `icon`
--
ALTER TABLE `icon`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `icontype`
--
ALTER TABLE `icontype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `planning`
--
ALTER TABLE `planning`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1751;

--
-- AUTO_INCREMENT for table `transfer`
--
ALTER TABLE `transfer`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`IconId`) REFERENCES `icon` (`Id`),
  ADD CONSTRAINT `account_ibfk_2` FOREIGN KEY (`GroupsId`) REFERENCES `groups` (`Id`);

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`IconId`) REFERENCES `icon` (`Id`),
  ADD CONSTRAINT `category_ibfk_2` FOREIGN KEY (`GroupsId`) REFERENCES `groups` (`Id`);

--
-- Constraints for table `finance`
--
ALTER TABLE `finance`
  ADD CONSTRAINT `finance_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `category` (`Id`);

--
-- Constraints for table `planning`
--
ALTER TABLE `planning`
  ADD CONSTRAINT `planning_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `category` (`Id`),
  ADD CONSTRAINT `planning_ibfk_2` FOREIGN KEY (`GroupsId`) REFERENCES `groups` (`Id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`UsersId`) REFERENCES `users` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
