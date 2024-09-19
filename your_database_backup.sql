-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: lms_db:3306
-- Generation Time: Sep 19, 2024 at 10:41 AM
-- Server version: 9.0.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: library_db
--

-- --------------------------------------------------------

--
-- Table structure for table books
--

CREATE TABLE books (
  id bigint UNSIGNED NOT NULL,
  title varchar(77) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  author varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  publisher varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  genre varchar(31) DEFAULT NULL,
  isbnNo varchar(13) DEFAULT NULL,
  numofPages int NOT NULL,
  totalNumberOfCopies int NOT NULL,
  availableNumberOfCopies int NOT NULL,
  coverImage varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table books
--

INSERT INTO books (id, title, author, publisher, genre, isbnNo, numofPages, totalNumberOfCopies, availableNumberOfCopies, coverImage) VALUES
(3, 'COMPUTER PROGRAMMING IN C, SECOND EDITION', 'RAJARAMAN, V.', 'PHI Learning Pvt. Ltd.', 'Computers', '9789388028349', 388, 4, 0, NULL),
(5, 'Core Python Programming', 'Wesley Chun', 'Prentice Hall Professional', 'Computers', '9780130260369', 805, 3, 2, NULL),
(6, 'Learn to Code by Solving Problems', 'Daniel Zingaro', 'No Starch Press', 'Computers', '9781718501331', 392, 3, 2, NULL),
(7, 'Programming Language Concepts', 'Carlo Ghezzi, Mehdi Jazayeri', 'John Wiley & Sons', 'Computers', '9781718501391', 456, 7, 6, NULL),
(8, 'Elements of Programming', 'Alexander Stepanov, Paul McJones', 'Lulu.com', 'Computers', '9780578222141', 282, 4, 4, NULL),
(9, 'Learning to Program', 'Steven Foote', 'Addison-Wesley Professional', 'Computers', '9780133795226', 336, 9, 9, NULL),
(10, 'Guide to Competitive Programming', 'Antti Laaksonen', 'Springer', 'Computers', '9783319725475', 283, 3, 3, NULL),
(12, 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Addison-Wesley Professional', 'Computers', '9780135956915', 390, 2, 1, NULL),
(13, 'Data-Oriented Programming', 'Yehonathan Sharvit', 'Simon and Schuster', 'Computers', '9781617298578', 422, 7, 7, NULL),
(14, 'A Book on C', 'Al Kelley, Ira Pohl', 'Benjamin-Cummings Publishing Company', 'Computers', '9780805300604', 548, 10, 10, NULL),
(15, 'Getting Inside Java - Beginners Guide', 'Prem Kumar', 'Pencil', 'Computers', '9789354386459', 208, 6, 6, NULL),
(16, 'Programming in C', 'Ashok N. Kamthane', 'Pencil', 'C (Computer program language)', '9789380856421', 657, 8, 8, NULL),
(17, 'Programming Fundamentals', 'Kenneth Leroy Busbee', 'Pencil', 'Computers', '9789888407491', 340, 5, 5, NULL),
(18, 'COMPUTER PROGRAMMING IN FORTRAN 77', 'V. RAJARAMAN', 'PHI Learning Pvt. Ltd.', 'Computers', '9788120311725', 212, 5, 5, NULL),
(19, 'Elements of Programming', 'Alexander A. Stepanov, Paul McJones', 'Addison-Wesley Professional', 'Computers', '9780321635372', 279, 4, 4, NULL),
(20, 'Programming in Lua', 'Roberto Ierusalimschy', 'Roberto Ierusalimschy', 'Computers', '9788590379829', 329, 10, 10, NULL),
(21, 'Programming Persistent Memory', 'Steve Scargall', 'Apress', 'Computers', '9781484249321', 384, 2, 2, NULL),
(22, 'Programming Problems', 'B. Green', 'Createspace Independent Pub', 'Computers', '9781475071962', 156, 9, 9, NULL),
(23, 'Expert Python Programming', 'Michał Jaworski, Tarek Ziadé', 'Packt Publishing Ltd', 'Computers', '9781801076197', 631, 4, 4, NULL),
(24, 'Practical Goal Programming', 'Dylan Jones, Mehrdad Tamiz', 'Springer Science & Business Media', 'Business & Economics', '9781441957719', 180, 9, 9, NULL),
(25, 'Fundamentals of Computer Programming with C#', 'Svetlin Nakov, Veselin Kolev', 'Faber Publishing', 'Computers', '9789544007737', 1132, 8, 8, NULL),
(26, 'Code', 'Charles Petzold', 'Microsoft Press', 'Computers', '9780137909292', 562, 11, 11, NULL),
(27, 'Programming in Python 3', 'Mark Summerfield', 'Pearson Education', 'Computers', '9780321606594', 552, 5, 5, NULL),
(28, 'Programming In C: A Practical Approach', 'Ajay Mittal', 'Pearson Education India', 'C (Computer program language)', '9788131729342', 768, 4, 4, NULL),
(29, 'The C++ Programming Language', 'Bjarne Stroustrup', 'Pearson Education India', 'C++ (Computer program language)', '9788131705216', 1034, 6, 6, NULL),
(30, 'Practical C++ Programming', 'Steve Oualline', '\"O\'Reilly Media, Inc.\"', 'Computers', '9781449367169', 576, 11, 11, NULL),
(31, 'Programming Erlang', 'Joe Armstrong', 'Pragmatic Bookshelf', 'Computers', '9781680504323', 755, 8, 8, NULL),
(32, 'Programming in Modula-3', 'Laszlo Böszörmenyi, Carsten Weich', 'Springer', 'Computers', '9783642646140', 571, 11, 11, NULL),
(33, 'The History Book', 'DK', 'Dorling Kindersley Ltd', 'History', '9780241282229', 354, 8, 8, NULL),
(34, 'The Lessons of History', 'Will Durant, Ariel Durant', 'Simon and Schuster', 'History', '9781439170199', 128, 3, 3, NULL),
(35, 'The History Book', 'Dorling Kindersley Publishing Staff', '', 'History', '9780241225929', 0, 3, 3, NULL),
(36, 'A Companion to the History of the Book', 'Simon Eliot, Jonathan Rose', 'John Wiley & Sons', 'Literary Criticism', '9781444356588', 617, 10, 10, NULL),
(37, 'The American College and University', 'Frederick Rudolph', 'University of Georgia Press', 'Education', '9780820312842', 592, 3, 3, NULL),
(38, 'That\'s Not in My American History Book', 'Thomas Ayres', 'Taylor Trade Publications', 'United States', '9781589791077', 257, 4, 4, NULL),
(39, 'An Introduction to Book History', 'David Finkelstein, Alistair McCleery', 'Routledge', 'Social Science', '9781134380060', 167, 10, 10, NULL),
(40, 'The Little Book of History', 'DK', 'Dorling Kindersley Ltd', 'History', '9780241547489', 503, 11, 11, NULL),
(41, 'End of History and the Last Man', 'Francis Fukuyama', 'Simon and Schuster', 'History', '9781416531784', 464, 5, 5, NULL),
(42, 'The Cambridge Companion to the History of the Book', 'Leslie Howsam', 'Cambridge University Press', 'Language Arts & Disciplines', '9781107023734', 301, 10, 10, NULL),
(43, 'A Little History of the World', 'E. H. Gombrich', 'Yale University Press', 'History', '9780300213973', 401, 5, 5, NULL),
(44, 'The History Book (Miles Kelly).', 'MAKE BELIEVE IDEAS LTD. MAKE BELIEVE IDEAS LTD, Simon Adams, Philip Steele, Stewart Ross, Richard Platt', 'Yale University Press', 'World history', '9781805443407', 0, 11, 11, NULL),
(45, 'Encyclopedia of Local History', 'Carol Kammen, Amy H. Wilson', 'Rowman & Littlefield Publishers', 'United States', '9780759120488', 0, 4, 4, NULL),
(46, 'History at the Limit of World-History', 'Ranajit Guha', 'Columbia University Press', 'History', '9780231505093', 156, 2, 2, NULL),
(47, 'A World at Arms', 'Gerhard L. Weinberg', 'Cambridge University Press', 'History', '9780521618267', 1216, 9, 9, NULL),
(48, 'Quirky History', 'Mini Menon', 'Harper Collins', 'Juvenile Nonfiction', '9789353578800', 184, 4, 4, NULL),
(49, 'A History of Modern India, 1480-1950', 'Claude Markovits', 'Anthem Press', 'History', '9781843311522', 617, 9, 9, NULL),
(50, 'Rethinking History', 'Keith Jenkins', 'Routledge', 'History', '9781134408283', 116, 4, 4, NULL),
(51, 'A History of History', 'Alun Munslow', 'Routledge', 'History', '9780415677141', 236, 10, 10, NULL),
(52, 'A History of India', 'Hermann Kulke, Dietmar Rothermund', 'Psychology Press', 'India', '9780415154826', 406, 3, 3, NULL),
(53, 'An Introduction to Book History', 'David Finkelstein, Alistair McCleery', 'Routledge', 'Design', '9780415688055', 178, 9, 9, NULL),
(54, 'What Is History, Now?', 'Suzannah Lipscomb, Helen Carr', 'Hachette UK', 'History', '9781474622486', 285, 2, 2, NULL),
(55, 'The Oxford Illustrated History of the Book', 'James Raven', 'Oxford University Press', 'Crafts & Hobbies', '9780191007507', 468, 4, 4, NULL),
(56, 'A Textbook of Historiography, 500 B.C. to A.D. 2000', 'E. Sreedharan', 'Orient Blackswan', 'History', '9788125026570', 600, 6, 6, NULL),
(57, 'A Concise History of Greece', 'Richard Clogg', 'Cambridge University Press', 'History', '9780521004794', 316, 6, 6, NULL),
(58, 'Time and Power', 'Christopher Clark', 'Princeton University Press', 'History', '9780691217321', 310, 7, 7, NULL),
(59, 'International Law and the Politics of History', 'Anne Orford', 'Cambridge University Press', 'History', '9781108480949', 395, 9, 9, NULL),
(60, 'National Geographic History Book', 'Marcus Cowper', 'National Geographic Books', 'History', '9781426206795', 188, 6, 6, NULL),
(61, 'Search History', 'Eugene Lim', 'Coffee House Press', 'Fiction', '9781566896269', 162, 8, 8, NULL),
(62, 'A History of the Modern World', 'Ranjan Chakrabarti', 'Primus Books', 'History, Modern', '9789380607504', 0, 6, 6, NULL),
(63, 'Sapiens', 'Yuval Noah Harari', 'Random House', 'History', '9781448190690', 353, 5, 5, NULL),
(64, 'The Past Before Us', 'Romila Thapar', 'Harvard University Press', 'History', '9780674726529', 915, 3, 3, NULL),
(65, 'History Education and Conflict Transformation', 'Charis Psaltis, Mario Carretero, Sabina Čehajić-Clancy', 'Springer', 'Education', '9783319546810', 389, 6, 6, NULL),
(66, 'The Calling of History', 'Dipesh Chakrabarty', 'University of Chicago Press', 'Biography & Autobiography', '9780226100456', 315, 4, 4, NULL),
(67, 'What is the History of the Book?', 'James Raven', 'John Wiley & Sons', 'History', '9781509523214', 196, 11, 11, NULL),
(68, 'Wise & Otherwise', 'Sudha Murthy', 'Penguin UK', 'Literary Collections', '9788184759006', 232, 3, 3, NULL),
(69, 'The Tastiest Of All', 'Sudha Murthy', 'Penguin UK', 'Juvenile Fiction', '9789351183594', 12, 7, 4, NULL),
(70, 'Grandma\'s Bag of Stories', 'Sudha Murthy', 'Puffin', 'Children\'s stories', '9780143333623', 192, 9, 9, NULL),
(71, 'The Seed of Truth', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183563', 13, 3, 3, NULL),
(72, 'The Day I Stopped Drinking Milk', 'Sudha Murthy', 'Penguin UK', 'Literary Collections', '9789351180555', 14, 4, 4, NULL),
(73, 'The Call', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180715', 10, 11, 11, NULL),
(74, 'A Fair Deal', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183556', 13, 6, 6, NULL),
(75, 'Three Women, Three Ponds', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180593', 10, 7, 7, NULL),
(76, 'Helping the Dead', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180586', 0, 5, 5, NULL),
(77, 'Genes', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180579', 0, 9, 9, NULL),
(78, 'A Woman\'s Ritual', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180685', 10, 3, 3, NULL),
(79, 'The Gift of Sacrifice', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180630', 0, 7, 7, NULL),
(80, 'No Man’s Garden', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180609', 0, 8, 8, NULL),
(81, 'The Best Friend', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183693', 13, 2, 2, NULL),
(82, 'Hindu Mother, Muslim Son', 'Sudha Murty', 'Penguin UK', 'Literary Collections', '9789351180531', 10, 10, 10, NULL),
(83, 'The Selfish Groom', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183860', 13, 11, 11, NULL),
(84, 'Uncle Sam', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180708', 0, 7, 7, NULL),
(85, 'The Wise King', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183662', 13, 2, 2, NULL),
(86, 'Lazy Portado', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180692', 0, 9, 9, NULL),
(87, 'Miserable Success', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180678', 0, 8, 8, NULL),
(88, 'Good Luck, Gopal', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183709', 14, 9, 9, NULL),
(89, 'Do You Remember?', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180739', 0, 3, 3, NULL),
(90, 'Teen Hazar Tanke', 'Sudha Murthy', '', 'Fiction', '9789352667437', 178, 3, 3, NULL),
(91, 'The Clever Brothers', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183761', 12, 10, 10, NULL),
(92, 'Sharing with a Ghost', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180654', 0, 2, 2, NULL),
(93, 'Sticky Bottoms', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180616', 0, 5, 5, NULL),
(94, 'Foot in the Mouth', 'Suddha Murty', 'Penguin UK', 'Literary Collections', '9789351180661', 0, 10, 10, NULL),
(95, 'MANADA MATU', 'Smt. Sudha Murthy', 'Sapna Book House (P) Ltd.', 'Authors, Kannada', '9788128004353', 186, 10, 10, NULL),
(96, 'Apna Deepak Swayam Banen', 'Sudha Murty', 'Prabhat Prakashan', 'Self-Help', '9788173155000', 90, 2, 2, NULL),
(97, 'Dollar Bahoo', 'Sudha Murty', 'Prabhat Prakashan', 'Fiction', '9788173153501', 99, 8, 8, NULL),
(98, 'Common Yet Uncommon (Hindi)/Sadharan Phir Bhi Asadharan/साधारण फिर भी असाधारण', 'Sudha Murthy/सुधा मूर्ति', 'Penguin Random House India Private Limited', 'Fiction', '9789357088961', 181, 9, 9, NULL),
(99, 'KANNADA : SAMANYARALLI ASAMANYARU', 'Smt. Sudha Murthy', 'Sapna Book House (P) Ltd.', 'Short stories, Kannada', '9788128005039', 183, 4, 4, NULL),
(100, 'Magic in the Air', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183853', 14, 5, 5, NULL),
(101, 'Emperor of Alakavati', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183730', 17, 8, 8, NULL),
(102, 'The Last Laddoo', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183587', 13, 8, 8, NULL),
(103, 'The White Crow', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183631', 13, 5, 5, NULL),
(104, 'The Magic Drum', 'Sudha Murthy', 'Penguin UK', 'Fiction', '9789351183907', 14, 7, 7, NULL),
(105, 'Sita', 'Amish Tripathi', 'Harper Collins', 'Fiction', '9789356290945', 333, 9, 9, NULL),
(106, 'The Oath of the Vayuputras', 'Amish Tripathi', 'Hachette UK', 'Fiction', '9781780874104', 400, 2, 2, NULL),
(107, 'The Bachelor Dad', 'Tusshar Kapoor', 'Penguin Random House India Private Limited', 'Biography & Autobiography', '9789354924255', 192, 5, 5, NULL),
(108, 'Xx C. Top', 'Vytenis Rozukas', 'AuthorHouse', 'Fiction', '9781496976987', 295, 3, 3, NULL),
(109, 'The Nine-Chambered Heart', 'Janice Pariat', 'Harper Collins', 'Fiction', '9789352773800', 216, 11, 11, NULL),
(110, 'Ramayana Pack (4 Volumes)', 'Shubha Vilas', 'Jaico Publishing House', 'Self-Help', '9789386867650', 1303, 6, 6, NULL),
(111, 'The Secret Of The Nagas (Shiva Trilogy Book 2)', 'Amish Tripathi', 'Harper Collins', 'Fiction', '9789356290679', 337, 3, 3, NULL),
(112, 'Ancient Promises', 'Jaishree Misra', 'Penguin Books India', 'East Indians', '9780140293593', 324, 6, 6, NULL),
(113, 'Advances in Computer and Computational Sciences', 'Sanjiv K. Bhatia, Krishn K. Mishra, Shailesh Tiwari, Vivek Kumar Singh', 'Springer', 'Technology & Engineering', '9789811037733', 713, 4, 4, NULL),
(114, 'The Sialkot Saga', 'Ashwin Sanghi', 'Harper Collins', 'Fiction', '9789356292468', 546, 2, 2, NULL),
(115, 'Son of the Thundercloud', 'Easterine Kire', '', 'Fiction', '9789386338143', 152, 4, 4, NULL),
(116, 'Fluid', 'Ashish Jaiswal', '', 'Education', '9788183285278', 256, 7, 7, NULL),
(117, 'The Liberation of Sita', 'Volga', 'Harper Collins', 'Fiction', '9789352775026', 128, 6, 6, NULL),
(118, 'The Eternal World', 'Christopher Farnsworth', 'HarperCollins', 'Fiction', '9780062282934', 365, 9, 9, NULL),
(119, 'Keepers of the Kalachakra', 'Ashwin Sanghi', 'Harper Collins', 'Fiction', '9789356292482', 374, 3, 3, NULL),
(120, 'Digital Hinduism', 'Xenia Zeiler', 'Routledge', 'Religion', '9781351607322', 304, 8, 8, NULL),
(121, 'The Illuminated', 'Anindita Ghose', 'Harper Collins', 'Fiction', '9789354226182', 234, 4, 4, NULL),
(122, 'Boats on Land', 'Janice Pariat', 'Random House India', 'Fiction', '9788184003390', 200, 6, 6, NULL),
(123, 'Cuckold', 'Kiran Nagarkar', 'Harper Collins', 'Fiction', '9789351770107', 633, 10, 10, NULL),
(124, 'Stories We Never Tell', 'Savi Sharma', 'Harper Collins', 'Fiction', '9789356293304', 204, 7, 7, NULL),
(125, 'The Fisher Queen\'s Dynasty', 'Kavita Kané', 'Rupa Publ iCat Ions India', 'Fiction', '9789355208767', 0, 10, 10, NULL),
(126, 'Chander and Sudha', 'Dharamvir Bharati', 'Penguin UK', 'Fiction', '9788184750294', 360, 6, 6, NULL),
(127, 'Living with Merlin', 'Anita Bakshi', 'Partridge Publishing', 'Self-Help', '9781482840193', 233, 8, 8, NULL),
(128, 'Ramayana: The Game of Life – Book 2: Conquer Change', 'Shubha Vilas', 'Jaico Publishing House', 'Religion', '9789386348906', 404, 9, 9, NULL),
(129, 'Food Fights', 'Charles C. Ludington, Matthew Morse Booker', '', 'Cooking', '9781469652894', 304, 8, 8, NULL),
(130, 'The Shape of Design', 'Frank Chimero', '', 'Design', '9780985472207', 131, 6, 6, NULL),
(131, 'Everyone Has a Story', 'Savi Sharma', '', 'Friendship', '9789386036759', 0, 8, 8, NULL),
(132, 'Go Kiss the World', 'Subroto Bagchi', 'Penguin Books India', 'Executives', '9780670082308', 260, 8, 8, NULL),
(133, 'Scion of Ikshvaku', 'Amish, Amish Tripathi', 'Westland Publication Limited', 'Hindu mythology', '9789385152146', 0, 6, 6, NULL),
(134, 'The Sand Fish', 'Maha Gargash', 'Harper Collins', 'Fiction', '9780061959868', 0, 3, 3, NULL),
(135, '2 States: The Story of My Marriage (Movie Tie-In Edition)', 'Chetan Bhagat', 'Rupa Publications', 'Fiction', '9788129132543', 280, 10, 10, NULL),
(136, 'The Woman on the Orient Express', 'Lindsay Jayne Ashford', 'Charnwood', 'Female friendship', '9781444836714', 416, 7, 7, NULL),
(137, 'Let\'s Talk Money', 'Monika Halan', 'Harper Collins', 'Business & Economics', '9789352779406', 184, 8, 8, NULL),
(138, 'Blind Faith', 'Sagarika Ghose', 'Harper Collins', 'Fiction', '9789351367994', 188, 3, 3, NULL),
(139, 'Dysmorphic Kingdom', 'Colleen Chen', '', 'Fantasy fiction', '9781940233239', 320, 6, 6, NULL),
(140, 'Advice and Dissent', 'Y.V. Reddy', 'Harper Collins', 'Biography & Autobiography', '9789352643059', 496, 7, 7, NULL),
(141, 'Angels & Demons', 'Dan Brown', 'Simon and Schuster', 'Fiction', '9780743493468', 496, 11, 11, NULL),
(142, 'Angels and Demons', 'Dan Brown', 'Corgi Books', 'Fiction', '9780552160896', 0, 3, 3, NULL),
(143, 'Angels & Demons', 'Dan Brown', 'Simon and Schuster', 'Anti-Catholicism', '9781416528654', 8, 9, 9, NULL),
(144, 'Angels & Demons Special Illustrated Edition', 'Dan Brown', 'Simon and Schuster', 'Fiction', '9780743277716', 532, 10, 10, NULL),
(145, 'Angels and Demons', 'Dan Brown', 'Random House', 'Anti-Catholicism', '9780552173469', 642, 5, 5, NULL),
(146, 'Angels and Demons', 'Serge-Thomas Bonino', 'CUA Press', 'Religion', '9780813227993', 345, 10, 10, NULL),
(147, 'Angels and Demons', 'Peter Kreeft', 'Ignatius Press', 'Religion', '9781681490380', 164, 4, 4, NULL),
(148, 'Angels and Demons', 'Benny Hinn', 'Benny Hinn Ministries', 'Religion', '9781590244593', 208, 11, 11, NULL),
(149, 'Dan Brown’s Robert Langdon Series', 'Dan Brown', 'Random House', 'Fiction', '9781473543201', 2082, 6, 6, NULL),
(150, 'The Mammoth Book of Angels & Demons', 'Paula Guran', 'Hachette UK', 'Fiction', '9781780338002', 405, 8, 8, NULL),
(151, 'The Eight', 'Katherine Neville', 'Open Road Media', 'Fiction', '9781504013673', 523, 5, 5, NULL),
(152, 'Angels, Demons and the New World', 'Fernando Cervantes, Andrew Redden', 'Cambridge University Press', 'Body, Mind & Spirit', '9780521764582', 331, 9, 9, NULL),
(153, 'Angels and Demons', 'Ron Phillips', 'Charisma Media', 'Body, Mind & Spirit', '9781629980348', 289, 11, 11, NULL),
(154, 'Angels And Demons', 'Dan Brown', 'Random House', 'Fiction', '9781409083948', 663, 4, 4, NULL),
(155, 'Secrets of Angels and Demons', 'Daniel Burstein', 'Random House', 'Popes in literature', '9780752876931', 595, 5, 5, NULL),
(156, 'Angels, Demons & Gods of the New Millenium', 'Lon Milo Duquette', 'Weiser Books', 'Body, Mind & Spirit', '9781578630103', 196, 4, 4, NULL),
(157, 'Angels and Demons in Art', 'Rosa Giorgi', 'Getty Publications', 'Angels in art', '9780892368303', 384, 3, 3, NULL),
(158, 'Demon Angel', 'Meljean Brook', 'Penguin', 'Fiction', '9781101568026', 411, 4, 4, NULL),
(159, 'Angels & Demons Rome', 'Angela K. Nickerson', 'Roaring Forties Press', 'Travel', '9780984316557', 71, 2, 2, NULL),
(160, 'What Does the Bible Say About Angels and Demons?', 'John Gillman, Clifford M. Yeary', 'New City Press', 'Religion', '9781565483804', 93, 9, 9, NULL),
(161, 'The Sherlock Holmes Mysteries', 'Sir Arthur Conan Doyle', 'Penguin', 'Fiction', '9780698168237', 546, 4, 4, NULL),
(162, 'Demons & Angels', 'J.K. Norry', 'Sudden Insight Publishing', 'Fiction', '9780990728030', 278, 5, 5, NULL),
(163, 'A Brief History of Angels and Demons', 'Sarah Bartlett', 'Hachette UK', 'Body, Mind & Spirit', '9781849018289', 164, 5, 5, NULL),
(164, 'Demons, Angels, and Writing in Ancient Judaism', 'Annette Yoshiko Reed', 'Cambridge University Press', 'Religion', '9780521119436', 365, 11, 11, NULL),
(165, 'An Angel, a Demon, a Candle', 'Cordelia Faass', 'Xlibris Corporation', 'Fiction', '9781479746750', 99, 4, 4, NULL),
(166, 'Sense and Nonsense about Angels and Demons', 'Kenneth Boa, Robert M. Bowman Jr.', 'Zondervan', 'Religion', '9780310254294', 161, 4, 4, NULL),
(167, 'Origin', 'Dan Brown', 'Mizan Publishing', 'Fiction', '9786022914426', 575, 11, 11, NULL),
(168, 'Angels, Satan and Demons', 'Robert Paul Lightner', 'Thomas Nelson', 'Angels', '9780849913716', 0, 10, 10, NULL),
(169, 'The Truth About Angels and Demons', 'Tony Evans', 'Moody Publishers', 'Religion', '9781575677286', 64, 11, 11, NULL),
(170, 'Angelfall', 'Susan Ee', 'Hachette UK', 'Fiction', '9781444778526', 320, 10, 10, NULL),
(171, 'Deception Point', 'Dan Brown', 'Pocket Books', 'Fiction', '9781982122355', 752, 9, 9, NULL),
(172, 'The Magick of Angels and Demons', 'Henry Archer', 'Independently Published', 'Body, Mind & Spirit', '9781796703405', 230, 6, 6, NULL),
(173, 'Angels, Demons, and the Devil', 'F. Lagard Smith', 'Cotswold Publishing', 'Religion', '9780966006063', 254, 9, 9, NULL),
(174, 'The Language of Demons and Angels', 'Christopher I. Lehrich', 'BRILL', 'Body, Mind & Spirit', '9789004135741', 276, 8, 8, NULL),
(175, 'Angels and Demons (Republish)', 'Dan Brown', 'Mizan Publishing', 'Fiction', '9786022914532', 0, 9, 9, NULL),
(176, 'JS GOOD PARTS', 'DOUGLAS CROCKFORD', 'OREILLY', 'COMPUTING', '1234567891234', 100, 5, 5, NULL),
(177, 'a', 'a', 'aa', 'a', 'a', 5, 4, 4, NULL),
(181, 'AA', 'AA', 'A', 'A', 'AAA', 1, 0, 0, NULL),
(184, 'tEST11', 'AA', 'A', 'A', 'AAAa', 1, 0, 0, NULL),
(185, 'tEST11', 'AA', 'A', 'A', 'AAAa5', 1, 0, 0, NULL),
(186, 'tEST11', 'AA', 'A', 'A', 'AAAa55', 1, 0, 0, NULL),
(188, 'tEST11', 'AA', 'A', 'A', 'AAAa5556', 1, 0, 0, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726604602/save_iwavov.png'),
(189, 'test', 'test', 'test', 'test', 'test', 5, 5, 5, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726608689/logoo_vyett9.png'),
(190, 'as', 'as', 'as', 'as', '7777', 5, 5, 5, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726631455/v_fz3qva.png'),
(191, 'as', 'as', 'as', 'as', '77778', 5, 5, 5, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726631690/save_eanjbm.png'),
(192, 'Test', 'test', 'test', 'test', '7894561237456', 5, 5, 5, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726633479/flexbox-froggy_ow77bh.png'),
(195, 'gf g', 'hhhg', 'huh', 'nnn', '77777744112.0', 8, 8, 8, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726654843/aaaa_rieyoj.png'),
(196, 'Spiderman into the spiderverse', 'Stan Lee', 'Marvel', 'Sci-fi', '4564564564565', 55, 55, 55, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726670227/flex_blnyxp.png'),
(197, 'python', 'vedanth', 'ved', 'comedy', '45645645', 5, 5, 5, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726672553/filesize_hiu707.png'),
(198, 'test2', 'test2', 'test2', 'test', '111', 1, 1, 1, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726720470/ddd_lne13t.png'),
(199, 'test55', 'test55', 'test55', 'test', '7891231231235', 5, 5, 5, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726740078/711AW7I8e8L._AC_UF1000_1000_QL80__n4wdyu.jpg'),
(200, 'new', 'new', 'new', 'new', '4564564567892', 5, 5, 5, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726740289/ddd_yrmp3v.png'),
(201, 'qqq', 'qqq', 'qqq', 'qqq', '7897897897893', 6, 6, 6, 'https://res.cloudinary.com/df1ae5amd/image/upload/v1726740390/711AW7I8e8L._AC_UF1000_1000_QL80__bxudlr.jpg');

-- --------------------------------------------------------

--
-- Table structure for table books_requests
--

CREATE TABLE books_requests (
  id bigint NOT NULL,
  uId varchar(255) NOT NULL,
  reqDate timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  returnDate varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  isbnNo varchar(15) NOT NULL,
  issuedDate date DEFAULT NULL,
  status tinyint(1) DEFAULT NULL,
  bookTitle varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table books_requests
--

INSERT INTO books_requests (id, uId, reqDate, returnDate, isbnNo, issuedDate, status, bookTitle) VALUES
(92, '49', '2024-09-19 09:18:49', NULL, '9780130260369', NULL, NULL, 'Core Python Programming'),
(94, '48', '2024-09-19 10:32:39', NULL, '9781718501331', NULL, 1, 'Learn to Code by Solving Problems');

-- --------------------------------------------------------

--
-- Table structure for table refreshTokens
--

CREATE TABLE refreshTokens (
  id int NOT NULL,
  userId varchar(255) NOT NULL,
  token varchar(255) NOT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table refreshTokens
--

INSERT INTO refreshTokens (id, userId, token, createdAt) VALUES
(22, '116126521594908398004', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTYxMjY1MjE1OTQ5MDgzOTgwMDQiLCJpYXQiOjE3MjQzMDIwMzcsImV4cCI6MTcyNDkwNjgzN30.GLPLI0KKOKPiBMnjox366KwNMVmRQ9os74IWT93rr10', '2024-08-22 04:47:17');

-- --------------------------------------------------------

--
-- Table structure for table traineees
--

CREATE TABLE traineees (
  id bigint UNSIGNED NOT NULL,
  name varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table traineees
--

INSERT INTO traineees (id, name) VALUES
(1, ''),
(2, ''),
(3, 'John Doe'),
(4, 'John Doe');

-- --------------------------------------------------------

--
-- Table structure for table transactions
--

CREATE TABLE transactions (
  transactionId int NOT NULL,
  userId int NOT NULL,
  bookId int NOT NULL,
  issueddate timestamp NOT NULL DEFAULT (now()),
  returnDate varchar(100) NOT NULL,
  isReturned tinyint NOT NULL DEFAULT '0',
  fine int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table transactions
--

INSERT INTO transactions (transactionId, userId, bookId, issueddate, returnDate, isReturned, fine) VALUES
(1, 49, 5, '2024-09-19 14:49:42', '', 0, 0),
(17, 48, 6, '2024-09-19 10:32:55', '2024-10-04', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table users
--

CREATE TABLE users (
  UId int NOT NULL,
  name varchar(150) NOT NULL,
  password varchar(255) NOT NULL,
  phoneNum varchar(13) DEFAULT NULL,
  DOB varchar(20) NOT NULL,
  email varchar(255) DEFAULT NULL,
  role varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table users
--

INSERT INTO users (UId, name, password, phoneNum, DOB, email, role) VALUES
(48, 'Nagarjuna GS', 'null', '8618333210', '2001-09-07', 'nagarjunags2014@gmail.com', 'admin'),
(49, 'Nagarjuna GS', 'null', '8618333211', '2001-01-01', 'nagarjuna.gs@codecraft.co.in', 'user');

-- --------------------------------------------------------

--
-- Table structure for table __drizzle_migrations
--

CREATE TABLE __drizzle_migrations (
  id bigint UNSIGNED NOT NULL,
  hash text NOT NULL,
  created_at bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table __drizzle_migrations
--

INSERT INTO __drizzle_migrations (id, hash, created_at) VALUES
(1, '6ac2eb8cd912d7d1af0e2beeaa9d580aea2c57eccec948a2e82d5077b2d107c9', 1721723609120),
(2, 'edd2507e20f42930441f90d23f68c459aa6c442984b76d712c3fb1506ef9882a', 1721802807123),
(3, 'c78a7d1c5fe0623a57af75406e86b85a1c88295b0b8b5b47e539d742eb9e1bfc', 1721884887555),
(4, '40ece4a07a176914d14a03eedeef0e42f15910933e7663224b3cf6e2546690b9', 1721885417561),
(5, '6dfbfcb59b02c983ef7db3d613ea2f073b965c8946aeb7ba63d3ec5ba7957b2b', 1721885439486),
(6, '2fb620770052ffb621a9e6d5b14af8c1cb8e6703ddb3cde669956ebe95c13c81', 1721885483445),
(7, 'c7571cfff7724601af5470de7b1f8996fdd17bbff418ff9f9c7c6362eb1ae5c3', 1723456047095),
(8, '9661aff9dea3ac18772368afa847201db45c0e0cab3d050b4988873d8b22fa12', 1723457549065),
(9, 'e76260ede384d52c52c12d801a838c3578fbb602b2c335d4dc4dbd15438c7117', 1723457743241);

--
-- Indexes for dumped tables
--

--
-- Indexes for table books
--
ALTER TABLE books
  ADD UNIQUE KEY id (id),
  ADD UNIQUE KEY isbnNo (isbnNo);

--
-- Indexes for table books_requests
--
ALTER TABLE books_requests
  ADD PRIMARY KEY (id);

--
-- Indexes for table refreshTokens
--
ALTER TABLE refreshTokens
  ADD PRIMARY KEY (id);

--
-- Indexes for table traineees
--
ALTER TABLE traineees
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY id (id);

--
-- Indexes for table transactions
--
ALTER TABLE transactions
  ADD PRIMARY KEY (transactionId);

--
-- Indexes for table users
--
ALTER TABLE users
  ADD PRIMARY KEY (UId);

--
-- Indexes for table __drizzle_migrations
--
ALTER TABLE __drizzle_migrations
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY id (id);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table books
--
ALTER TABLE books
  MODIFY id bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=202;

--
-- AUTO_INCREMENT for table books_requests
--
ALTER TABLE books_requests
  MODIFY id bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table refreshTokens
--
ALTER TABLE refreshTokens
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table traineees
--
ALTER TABLE traineees
  MODIFY id bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table transactions
--
ALTER TABLE transactions
  MODIFY transactionId int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table users
--
ALTER TABLE users
  MODIFY UId int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table __drizzle_migrations
--
ALTER TABLE __drizzle_migrations
  MODIFY id bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;