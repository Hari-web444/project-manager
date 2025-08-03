-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: project_manager
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `user_recid` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_recid`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (2,'Admin','admin@123','2025-07-31 16:37:35');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) DEFAULT 'employee',
  `emp_name` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(45) DEFAULT 'Test@123',
  `isDeleted` varchar(45) DEFAULT '0',
  PRIMARY KEY (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (4,'employee','Savitha9','Engineering','harirv.krish@gmail.com','8220265765','admin','2025-08-01 00:49:32','Test@123','1'),(5,'employee','Harry','Engineering','harry.potter1@gmail.cog','8220265701','admin','2025-08-01 00:49:32','Test@123','1'),(6,'employee','Hermione Granger','HR','hermione.granger2@gmail.com','8220265702','admin','2025-08-01 00:49:32','Test@123','1'),(7,'employee','Ron Weasley','IT','ron.weasley3@gmail.com','8220265703','admin','2025-08-01 00:49:32','Test@123','1'),(8,'employee','Draco Malfoy','Sales','draco.malfoy4@gmail.com','8220265704','admin','2025-08-01 00:49:32','Test@123','1'),(9,'employee','Luna Lovegood','Marketing','luna.lovegood5@gmail.com','8220265705','admin','2025-08-01 00:49:32','Test@123','1'),(10,'employee','Neville Longbottom','Finance','neville.longbottom6@gmail.com','8220265706','admin','2025-08-01 00:49:32','Test@123','1'),(11,'employee','Ginny Weasley','HR','ginny.weasley7@gmail.com','8220265707','admin','2025-08-01 00:49:32','Test@123','1'),(12,'employee','Sirius Black','IT','sirius.black8@gmail.com','8220265708','admin','2025-08-01 00:49:32','Test@123','1'),(13,'employee','Remus Lupin','Sales','remus.lupin9@gmail.com','8220265709','admin','2025-08-01 00:49:32','Test@123','1'),(14,'employee','Severus Snape','Marketing','severus.snape10@gmail.com','8220265710','admin','2025-08-01 00:49:32','Test@123','1'),(15,'employee','Albus Dumbledore','Finance','albus.dumbledore11@gmail.com','8220265711','admin','2025-08-01 00:49:32','Test@123','0'),(16,'employee','Minerva McGonagall','HR','minerva.mcgonagall12@gmail.com','8220265712','admin','2025-08-01 00:49:32','Test@123','0'),(17,'employee','Rubeus Hagrid','Finance','rubeus.hagrid13@gmail.com','822026571','admin','2025-08-01 00:49:32','Test@123','0'),(18,'employee','Cho Chang','Sales','cho.chang14@gmail.com','8220265714','admin','2025-08-01 00:49:32','Test@123','0'),(19,'employee','Cedric Diggory','Marketing','cedric.diggory15@gmail.com','8220265715','admin','2025-08-01 00:49:32','Test@123','0'),(20,'employee','Peter Pettigrew','Finance','peter.pettigrew16@gmail.com','8220265716','admin','2025-08-01 00:49:32','Test@123','0'),(21,'employee','Bellatrix Lestrange','HR','bellatrix.lestrange17@gmail.com','8220265717','admin','2025-08-01 00:49:32','Test@123','0'),(22,'employee','Lucius Malfoy','IT','lucius.malfoy18@gmail.com','8220265718','admin','2025-08-01 00:49:32','Test@123','0'),(23,'employee','Nymphadora Tonks','Sales','nymphadora.tonks19@gmail.com','8220265719','admin','2025-08-01 00:49:32','Test@123','0'),(24,'employee','Kingsley Shacklebolt','Marketing','kingsley.shacklebolt20@gmail.com','8220265720','admin','2025-08-01 00:49:32','Test@123','0'),(25,'employee','Arthur Weasley','Finance','arthur.weasley21@gmail.com','8220265721','admin','2025-08-01 00:49:32','Test@123','0'),(26,'employee','Molly Weasley','HR','molly.weasley22@gmail.com','8220265722','admin','2025-08-01 00:49:32','Test@123','0'),(27,'employee','Fred Weasley','IT','fred.weasley23@gmail.com','8220265723','admin','2025-08-01 00:49:32','Test@123','0'),(28,'employee','George Weasley','Sales','george.weasley24@gmail.com','8220265724','admin','2025-08-01 00:49:32','Test@123','0'),(29,'employee','Percy Weasley','Marketing','percy.weasley25@gmail.com','8220265725','admin','2025-08-01 00:49:32','Test@123','0'),(30,'employee','Fleur Delacour','Finance','fleur.delacour26@gmail.com','8220265726','admin','2025-08-01 00:49:32','Test@123','0'),(31,'employee','Viktor Krum','HR','viktor.krum27@gmail.com','8220265727','admin','2025-08-01 00:49:32','Test@123','0'),(32,'employee','Igor Karkaroff','IT','igor.karkaroff28@gmail.com','8220265728','admin','2025-08-01 00:49:32','Test@123','0'),(33,'employee','Horace Slughorn','Sales','horace.slughorn29@gmail.com','8220265729','admin','2025-08-01 00:49:32','Test@123','0'),(34,'employee','Cornelius Fudge','Marketing','cornelius.fudge30@gmail.com','8220265730','admin','2025-08-01 00:49:32','Test@123','0'),(35,'employee','Hari','Engineering','wefewew@gmail.ckk','687767878','admin','2025-08-01 01:36:36','Test@123','0'),(36,'employee','Arun','Marketing','info@neurolinkai.ai','9345115061','admin','2025-08-01 02:39:02','9345115061','0'),(43,'employee','Vishnu2','HR','info@neurolinkai.ai1','8220260000','admin','2025-08-01 08:54:29','8220260000','0'),(44,'employee','Karthika','Finance','info@neurolinkai.ai','9345115061','admin','2025-08-01 08:56:05','9345115061','0'),(45,'employee','Ajith','Engineering','hariharan@neuronestai.in','9345115061','admin','2025-08-01 18:20:37','9345115061','0');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `not_recid` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `notification` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL,
  PRIMARY KEY (`not_recid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'Update','Harry successfully updated.','2025-08-03 09:25:43','1'),(2,'Delete','Harry was deleted.','2025-08-03 09:27:53','1'),(3,'Delete','Luna Lovegood was deleted.','2025-08-03 09:28:04','1'),(4,'Delete','Ginny Weasley was deleted.','2025-08-03 09:31:32','1'),(5,'Delete','Sirius Black was deleted.','2025-08-03 09:32:40','1'),(6,'Delete','Severus Snape was deleted.','2025-08-03 09:37:59','1'),(7,'Update','Albus Dumbledorea successfully updated.','2025-08-03 09:38:16','1'),(8,'Update','Albus Dumbledore successfully updated.','2025-08-03 09:41:09','1'),(9,'Update','Rubeus Hagrid successfully updated.','2025-08-03 09:41:24','1');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'project_manager'
--

--
-- Dumping routines for database 'project_manager'
--
/*!50003 DROP PROCEDURE IF EXISTS `SP_GetEmpData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GetEmpData`()
BEGIN
     
     SELECT 
        emp_id,
        emp_name,
        department,
        email,
        phone,
        created_by,
        created_at
    FROM
        employee WHERE isDeleted = 0 ;
     
 END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_GetNotificationData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GetNotificationData`()
BEGIN
     
     SELECT 
        not_recid, type, notification, created_at, created_by
    FROM
        notification ;
     
 END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SP_SaveEmpData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_SaveEmpData`(
    IN p_emp_name VARCHAR(100),
    IN p_department VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_created_by VARCHAR(100)
)
BEGIN
    INSERT INTO employee (
        emp_name,
        department,
        email,
        phone,
        created_by,
        created_at,
        password
    ) VALUES (
        p_emp_name,
        p_department,
        p_email,
        p_phone,
        p_created_by,
        NOW(),
        p_phone
    );

    INSERT INTO notification ( type, notification, created_by) VALUES ("Add", CONCAT(p_emp_name," successfully inserted."), 1);
    SELECT * FROM employee WHERE emp_id = LAST_INSERT_ID();
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-03 10:24:57
