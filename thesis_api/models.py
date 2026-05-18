from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Junction tables
thesis_period = db.Table('thesis_period',
    db.Column('thesis_id', db.Integer, db.ForeignKey('theses.thesis_id'), primary_key=True),
    db.Column('period_id', db.Integer, db.ForeignKey('academic_periods.period_id'), primary_key=True)
)

class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    school = db.Column(db.String(100))
    institution = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    
    completed_curriculum = db.Column(db.Boolean, default=False)
    cleared_library = db.Column(db.Boolean, default=False)
    cleared_laboratory = db.Column(db.Boolean, default=False)
    
    thesis = db.relationship('Thesis', backref='student', uselist=False, lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'student_id': self.student_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'school': self.school,
            'institution': self.institution,
            'email': self.email,
            'phone': self.phone,
            'completed_curriculum': self.completed_curriculum,
            'cleared_library': self.cleared_library,
            'cleared_laboratory': self.cleared_laboratory,
            'has_thesis': self.thesis is not None
        }

class Professor(db.Model):
    __tablename__ = 'professors'
    professor_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    school = db.Column(db.String(100))
    institution = db.Column(db.String(100))
    email = db.Column(db.String(100))

    def to_dict(self):
        return {
            'professor_id': self.professor_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'school': self.school,
            'institution': self.institution,
            'email': self.email
        }

class AcademicPeriod(db.Model):
    __tablename__ = 'academic_periods'
    period_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

class Thesis(db.Model):
    __tablename__ = 'theses'
    thesis_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    abstract = db.Column(db.Text)
    status = db.Column(db.String(50), default='Draft')
    stage = db.Column(db.String(50), default='Thesis I')
    
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), unique=True, nullable=False)
    
    requirements = db.relationship('Requirement', backref='thesis', lazy=True, cascade="all, delete-orphan")
    plagiarism_check = db.relationship('PlagiarismCheck', backref='thesis', uselist=False, lazy=True, cascade="all, delete-orphan")
    defense = db.relationship('Defense', backref='thesis', uselist=False, lazy=True, cascade="all, delete-orphan")
    
    periods = db.relationship('AcademicPeriod', secondary=thesis_period, lazy='subquery', backref=db.backref('theses', lazy=True))
    
    tutors = db.relationship('TutorAssignment', backref='thesis', lazy=True, cascade="all, delete-orphan")
    reviewers = db.relationship('ReviewerAssignment', backref='thesis', lazy=True, cascade="all, delete-orphan")

    @property
    def custom_id(self):
        return f"ISEM2026{self.thesis_id:03d}"

    def to_dict(self):
        return {
            'thesis_id': self.thesis_id,
            'custom_id': self.custom_id,
            'title': self.title,
            'abstract': self.abstract,
            'status': self.status,
            'stage': self.stage,
            'student_id': self.student_id,
            'student_name': f"{self.student.first_name} {self.student.last_name}" if self.student else None,
            'student_school': self.student.school if self.student else None,
            'tutors': [{'professor_id': t.professor_id, 'name': f"{t.professor.first_name} {t.professor.last_name}", 'role': t.role} for t in self.tutors],
            'reviewers': [{'professor_id': r.professor_id, 'name': f"{r.professor.first_name} {r.professor.last_name}", 'role': r.role, 'comments': r.comments, 'revision_corrected': r.revision_corrected} for r in self.reviewers]
        }

class Requirement(db.Model):
    __tablename__ = 'requirements'
    requirement_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    thesis_id = db.Column(db.Integer, db.ForeignKey('theses.thesis_id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.Boolean, default=False)

class PlagiarismCheck(db.Model):
    __tablename__ = 'plagiarism_checks'
    check_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    thesis_id = db.Column(db.Integer, db.ForeignKey('theses.thesis_id'), unique=True, nullable=False)
    similarity_percentage = db.Column(db.Numeric(5, 2))

class Defense(db.Model):
    __tablename__ = 'defenses'
    defense_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    thesis_id = db.Column(db.Integer, db.ForeignKey('theses.thesis_id'), unique=True, nullable=False)
    date = db.Column(db.Date)
    time = db.Column(db.String(50))
    location = db.Column(db.String(100))
    modality = db.Column(db.String(50)) # e.g. In-person or Virtual
    final_grade = db.Column(db.Numeric(4, 2))

    def to_dict(self):
        return {
            'defense_id': self.defense_id,
            'thesis_id': self.thesis_id,
            'thesis_title': self.thesis.title if self.thesis else None,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time,
            'location': self.location,
            'modality': self.modality,
            'final_grade': float(self.final_grade) if self.final_grade else None
        }

class TutorAssignment(db.Model):
    __tablename__ = 'tutor_assignments'
    thesis_id = db.Column(db.Integer, db.ForeignKey('theses.thesis_id'), primary_key=True)
    professor_id = db.Column(db.Integer, db.ForeignKey('professors.professor_id'), primary_key=True)
    role = db.Column(db.Enum('Tutor', 'Co-Tutor', name='tutor_roles'), primary_key=True)
    
    professor = db.relationship('Professor')

class ReviewerAssignment(db.Model):
    __tablename__ = 'reviewer_assignments'
    thesis_id = db.Column(db.Integer, db.ForeignKey('theses.thesis_id'), primary_key=True)
    professor_id = db.Column(db.Integer, db.ForeignKey('professors.professor_id'), primary_key=True)
    role = db.Column(db.String(50)) # President, Committee
    comments = db.Column(db.Text)
    revision_corrected = db.Column(db.Boolean, default=False)
    
    professor = db.relationship('Professor')
