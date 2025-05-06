DROP TABLE IF EXISTS usertype;

CREATE TABLE `usertype` (
  `usertype_id` int NOT NULL AUTO_INCREMENT,
  `user_type` varchar(50) NOT NULL,
  `user_typecode` varchar(20) NOT NULL,
  PRIMARY KEY (`usertype_id`),
  UNIQUE KEY `user_type` (`user_type`),
  UNIQUE KEY `user_typecode` (`user_typecode`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO usertype (user_type, user_typecode) 
VALUES 
    ('Admin', "AD"),
    ('Telecalling sales', "TSL"),
    ('Telecalling class', "TCL");
    
