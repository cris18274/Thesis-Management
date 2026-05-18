from flask import Blueprint, request, jsonify
from models import db, Student, Professor, Thesis, Requirement, PlagiarismCheck, Defense, TutorAssignment, ReviewerAssignment

api_bp = Blueprint('api', __name__)

# --- STUDENTS ---
@api_bp.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students]), 200

@api_bp.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    s = Student.query.get_or_404(student_id)
    return jsonify(s.to_dict()), 200

@api_bp.route('/students', methods=['POST'])
def create_student():
    data = request.get_json()
    if not data or not data.get('first_name') or not data.get('last_name') or not data.get('email'):
        return jsonify({'error': 'first_name, last_name, and email are required'}), 400
    if Student.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    s = Student(
        first_name=data['first_name'],
        last_name=data['last_name'],
        school=data.get('school', ''),
        institution=data.get('institution', ''),
        email=data['email'],
        phone=data.get('phone'),
        completed_curriculum=data.get('completed_curriculum', False),
        cleared_library=data.get('cleared_library', False),
        cleared_laboratory=data.get('cleared_laboratory', False)
    )
    db.session.add(s)
    db.session.commit()
    return jsonify({'student_id': s.student_id, 'message': 'Created'}), 201

@api_bp.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    s = Student.query.get_or_404(student_id)
    data = request.get_json()
    s.first_name = data.get('first_name', s.first_name)
    s.last_name = data.get('last_name', s.last_name)
    s.school = data.get('school', s.school)
    s.institution = data.get('institution', s.institution)
    s.email = data.get('email', s.email)
    s.phone = data.get('phone', s.phone)
    s.completed_curriculum = data.get('completed_curriculum', s.completed_curriculum)
    s.cleared_library = data.get('cleared_library', s.cleared_library)
    s.cleared_laboratory = data.get('cleared_laboratory', s.cleared_laboratory)
    db.session.commit()
    return jsonify({'message': 'Updated'}), 200

@api_bp.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    s = Student.query.get_or_404(student_id)
    db.session.delete(s)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200


# --- THESES ---
@api_bp.route('/theses', methods=['GET'])
def get_theses():
    theses = Thesis.query.all()
    return jsonify([t.to_dict() for t in theses]), 200

@api_bp.route('/theses/<int:thesis_id>', methods=['GET'])
def get_thesis(thesis_id):
    t = Thesis.query.get_or_404(thesis_id)
    return jsonify(t.to_dict()), 200

@api_bp.route('/theses', methods=['POST'])
def create_thesis():
    data = request.get_json()
    if not data or not data.get('title') or not data.get('student_id'):
        return jsonify({'error': 'title and student_id are required'}), 400
    
    # Check if student exists
    student = Student.query.get(data['student_id'])
    if not student:
        return jsonify({'error': 'Student not found'}), 404
        
    # Check if student already has a thesis
    if Thesis.query.filter_by(student_id=data['student_id']).first():
        return jsonify({'error': 'Student already has a thesis'}), 409
        
    t = Thesis(
        title=data['title'],
        abstract=data.get('abstract', ''),
        status=data.get('status', 'Draft'),
        student_id=data['student_id']
    )
    db.session.add(t)
    db.session.commit()
    return jsonify({'thesis_id': t.thesis_id, 'message': 'Created'}), 201

@api_bp.route('/theses/<int:thesis_id>', methods=['PUT'])
def update_thesis(thesis_id):
    t = Thesis.query.get_or_404(thesis_id)
    data = request.get_json()
    t.title = data.get('title', t.title)
    t.abstract = data.get('abstract', t.abstract)
    t.status = data.get('status', t.status)
    t.stage = data.get('stage', t.stage)
    db.session.commit()
    return jsonify({'message': 'Updated'}), 200

@api_bp.route('/theses/<int:thesis_id>', methods=['DELETE'])
def delete_thesis(thesis_id):
    t = Thesis.query.get_or_404(thesis_id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200


# --- ASSIGNMENTS ---
@api_bp.route('/theses/<int:thesis_id>/tutors', methods=['POST'])
def assign_tutor(thesis_id):
    data = request.get_json()
    if not data or not data.get('professor_id') or not data.get('role'):
        return jsonify({'error': 'professor_id and role are required'}), 400
        
    if TutorAssignment.query.filter_by(thesis_id=thesis_id, professor_id=data['professor_id'], role=data['role']).first():
        return jsonify({'error': 'Tutor assignment already exists'}), 409
        
    assignment = TutorAssignment(
        thesis_id=thesis_id,
        professor_id=data['professor_id'],
        role=data['role']
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify({'message': 'Tutor assigned'}), 201

@api_bp.route('/theses/<int:thesis_id>/reviewers', methods=['POST'])
def assign_reviewer(thesis_id):
    data = request.get_json()
    if not data or not data.get('professor_id'):
        return jsonify({'error': 'professor_id is required'}), 400
        
    if ReviewerAssignment.query.filter_by(thesis_id=thesis_id, professor_id=data['professor_id']).first():
        return jsonify({'error': 'Reviewer assignment already exists'}), 409
        
    assignment = ReviewerAssignment(
        thesis_id=thesis_id,
        professor_id=data['professor_id'],
        role=data.get('role', 'Committee')
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify({'message': 'Reviewer assigned'}), 201

@api_bp.route('/theses/<int:thesis_id>/reviewers/<int:professor_id>', methods=['PUT'])
def update_reviewer(thesis_id, professor_id):
    assignment = ReviewerAssignment.query.filter_by(thesis_id=thesis_id, professor_id=professor_id).first_or_404()
    data = request.get_json()
    assignment.role = data.get('role', assignment.role)
    assignment.comments = data.get('comments', assignment.comments)
    assignment.revision_corrected = data.get('revision_corrected', assignment.revision_corrected)
    db.session.commit()
    return jsonify({'message': 'Reviewer assignment updated'}), 200

# --- DEFENSES ---
@api_bp.route('/defenses', methods=['GET'])
def get_defenses():
    defenses = Defense.query.all()
    return jsonify([d.to_dict() for d in defenses]), 200

@api_bp.route('/defenses', methods=['POST'])
def create_defense():
    data = request.get_json()
    if not data or not data.get('thesis_id'):
        return jsonify({'error': 'thesis_id is required'}), 400
        
    if Defense.query.filter_by(thesis_id=data['thesis_id']).first():
        return jsonify({'error': 'Defense already scheduled for this thesis'}), 409
        
    d = Defense(
        thesis_id=data['thesis_id'],
        date=data.get('date'),
        time=data.get('time'),
        location=data.get('location'),
        modality=data.get('modality')
    )
    db.session.add(d)
    db.session.commit()
    return jsonify({'defense_id': d.defense_id, 'message': 'Defense scheduled'}), 201

@api_bp.route('/defenses/<int:defense_id>', methods=['PUT'])
def update_defense(defense_id):
    d = Defense.query.get_or_404(defense_id)
    data = request.get_json()
    d.date = data.get('date', d.date)
    d.time = data.get('time', d.time)
    d.location = data.get('location', d.location)
    d.modality = data.get('modality', d.modality)
    d.final_grade = data.get('final_grade', d.final_grade)
    db.session.commit()
    return jsonify({'message': 'Defense updated'}), 200


# --- PROFESSORS ---
@api_bp.route('/professors', methods=['GET'])
def get_professors():
    professors = Professor.query.all()
    return jsonify([p.to_dict() for p in professors]), 200

@api_bp.route('/professors', methods=['POST'])
def create_professor():
    data = request.get_json()
    if not data or not data.get('first_name') or not data.get('last_name'):
        return jsonify({'error': 'first_name and last_name are required'}), 400
        
    p = Professor(
        first_name=data['first_name'],
        last_name=data['last_name'],
        school=data.get('school', ''),
        institution=data.get('institution', ''),
        email=data.get('email', '')
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({'professor_id': p.professor_id, 'message': 'Created'}), 201

# --- DASHBOARD METRICS ---
@api_bp.route('/metrics', methods=['GET'])
def get_metrics():
    total_students = Student.query.count()
    total_theses = Thesis.query.count()
    active_theses = Thesis.query.filter(Thesis.status != 'Defended').count()
    total_professors = Professor.query.count()
    
    return jsonify({
        'totalStudents': total_students,
        'totalTheses': total_theses,
        'activeTheses': active_theses,
        'totalProfessors': total_professors
    }), 200
