package com.example.networker_test.service.user;

import com.example.networker_test.domain.user.User;
import com.example.networker_test.domain.user.UserRepository;
import com.example.networker_test.dto.user.reponese.UserResponse;
import com.example.networker_test.dto.user.request.UserCreateRequest;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Transactional
    public ResponseEntity<String> signupUser(UserCreateRequest request) {
        logger.info("Received signup request: email={}, nationality={}, password={}",
                request.getEmail(), request.getNationality(), request.getPassword());

        try {

            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                logger.warn("Email {} is already registered", request.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 등록된 아이디입니다.");
            }

            if (!isValidPassword(request.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호는 최소 8자 이상이어야 합니다.");
            }

            userRepository.save(new User(request.getEmail(), request.getPassword(), request.getNationality()));

            return ResponseEntity.ok("회원가입이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            logger.error("Error occurred while signing up user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입에 실패했습니다. 다시 시도해주세요.");
        }

    }


    @Transactional
    public ResponseEntity<String> loginUser(UserCreateRequest request,  HttpSession session) {
        logger.info("Received login request: email={}, password={}", request.getEmail(), request.getPassword());

        try {
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

            if (userOptional.isEmpty()) {
                logger.info("No user found with email: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"아이디가 틀렸습니다. 다시 시도해주세요.\"}");
            }

            User user = userOptional.get();
            logger.info("User found with email: {}", user.getEmail());
            logger.info("Stored password from DB (plaintext): {}", user.getPassword());
            logger.info("Password to compare (plaintext): {}", request.getPassword());

            if (user.getPassword().equals(request.getPassword())) {
                logger.info("Password matches for email: {}", user.getEmail());

                session.setAttribute("user", user);

                return ResponseEntity.ok("{\"message\": \"로그인이 성공적으로 완료되었습니다.\"}");
            }

            logger.info("Password does not match for email: {}", user.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"비밀번호를 틀렸습니다.\"}");
        } catch (Exception e) {
            logger.error("Error occurred while login user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"로그인에 실패했습니다. 다시 시도해주세요.\"}");
        }
    }





    @Transactional
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getEmail(), user.getNationality(), user.getPassword()))
                .collect(Collectors.toList());
    }

    private boolean isValidPassword(String password) {
        return password != null && password.length() >= 8;
    }
}

