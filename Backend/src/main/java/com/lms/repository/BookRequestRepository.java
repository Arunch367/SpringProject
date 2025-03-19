package com.lms.repository;

import com.lms.model.BookRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    List<BookRequest> findByUserId(long userId);
    Optional<BookRequest> findTopByBookIdAndUserIdOrderByIdDesc(Long bookId, Long userId);
}
