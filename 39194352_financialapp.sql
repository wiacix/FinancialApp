-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql8
-- Generation Time: Dec 10, 2024 at 03:17 PM
-- Wersja serwera: 8.0.33-25
-- Wersja PHP: 8.2.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `39194352_financialapp`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `account`
--

CREATE TABLE `account` (
  `Id` int NOT NULL,
  `Code` int NOT NULL,
  `Active` int NOT NULL,
  `Name` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL,
  `Balance` float NOT NULL,
  `IconId` int NOT NULL,
  `Color` varchar(20) COLLATE utf8mb3_polish_ci NOT NULL,
  `Status` int NOT NULL COMMENT '0-nieliczone, 1-normalne konto, 2-dziesiecina, 3-obligacje',
  `GroupsId` int NOT NULL,
  `UpdateDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `category`
--

CREATE TABLE `category` (
  `Id` int NOT NULL,
  `Name` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL,
  `Type` int NOT NULL,
  `Planned` float DEFAULT NULL,
  `IconId` int NOT NULL,
  `Color` varchar(20) COLLATE utf8mb3_polish_ci NOT NULL,
  `GroupsId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

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
  `Id` int NOT NULL,
  `CategoryId` int NOT NULL,
  `AccountCode` int NOT NULL,
  `Amount` float NOT NULL,
  `Date` date NOT NULL,
  `Description` varchar(150) COLLATE utf8mb3_polish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `groups`
--

CREATE TABLE `groups` (
  `Id` int NOT NULL,
  `Name` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL,
  `Code` varchar(6) COLLATE utf8mb3_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `icon`
--

CREATE TABLE `icon` (
  `Id` int NOT NULL,
  `Type` int NOT NULL,
  `Picture` varchar(25) COLLATE utf8mb3_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

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
  `Id` int NOT NULL,
  `NamePL` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL,
  `NameEN` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

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
  `Id` int NOT NULL,
  `CategoryId` int NOT NULL,
  `Date` date NOT NULL,
  `PlannedAmount` float NOT NULL,
  `GroupsId` int NOT NULL,
  `Status` int NOT NULL COMMENT '0 - Nie zatwierdzone, 1 - zatwierdzone, 2 - zamknięte'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `sessions`
--

CREATE TABLE `sessions` (
  `Id` int NOT NULL,
  `UsersId` int NOT NULL,
  `Date` datetime NOT NULL,
  `SessionKey` varchar(15) COLLATE utf8mb3_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `transfer`
--

CREATE TABLE `transfer` (
  `Id` int NOT NULL,
  `FromAccountCode` int NOT NULL,
  `ToAccountCode` int NOT NULL,
  `Amount` float NOT NULL,
  `Date` date NOT NULL,
  `Description` varchar(150) COLLATE utf8mb3_polish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `Id` int NOT NULL,
  `Login` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL,
  `Password` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL,
  `Name` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL,
  `Surname` varchar(50) COLLATE utf8mb3_polish_ci NOT NULL,
  `GroupsId` varchar(50) COLLATE utf8mb3_polish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_polish_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`Id`);

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
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `finance`
--
ALTER TABLE `finance`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `icon`
--
ALTER TABLE `icon`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `icontype`
--
ALTER TABLE `icontype`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `planning`
--
ALTER TABLE `planning`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transfer`
--
ALTER TABLE `transfer`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
