package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class DemoApplication implements CommandLineRunner{

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}


	@Override
	public void run(String... args) throws Exception {
		String sql = "INSERT INTO students (first_name, last_name, city, phone, gender, email, address, postcode, date_of_birth) VALUES ( 'Sasha', 'Black', 'Ilava', '55555555555', 'Female', 'mailn8@bravesites.com', '97228 Emmalee Harbors Suite 421 South Emmet, TX 54950', 23031, '2001-12-16')";

		int rows = jdbcTemplate.update(sql);
		if (rows > 0) {
			System.out.println("A new row has been inserted.");
		}
	}
}
