-- Meslek Avcıları — Veritabanı Şeması
-- PostgreSQL'de çalıştır: psql -U postgres -d MeslekAvcilaridb -f schema.sql

CREATE TABLE IF NOT EXISTS students (
  id            SERIAL PRIMARY KEY,
  school_name   VARCHAR(255) NOT NULL,
  teacher_name  VARCHAR(255),
  audience_group VARCHAR(20) NOT NULL CHECK (audience_group IN ('ilkokul', 'ortaokul', 'lise')),
  student_name  VARCHAR(255) NOT NULL,
  profession    VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İstatistik sorgularını hızlandırmak için indeksler
CREATE INDEX IF NOT EXISTS idx_students_school      ON students(school_name);
CREATE INDEX IF NOT EXISTS idx_students_profession  ON students(profession);
CREATE INDEX IF NOT EXISTS idx_students_audience    ON students(audience_group);
CREATE INDEX IF NOT EXISTS idx_students_created_at  ON students(created_at DESC);
