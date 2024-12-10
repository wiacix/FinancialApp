-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Paź 14, 2024 at 05:27 PM
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

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `groups`
--

CREATE TABLE `groups` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Code` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

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
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IconId` (`IconId`),
  ADD KEY `GroupsId` (`GroupsId`);

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

--
-- Constraints for table `transfer`
--
ALTER TABLE `transfer`
  ADD CONSTRAINT `transfer_ibfk_1` FOREIGN KEY (`FromAccountCode`) REFERENCES `account` (`Id`),
  ADD CONSTRAINT `transfer_ibfk_2` FOREIGN KEY (`ToAccountCode`) REFERENCES `account` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
