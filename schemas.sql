CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) UNIQUE NOT NULL,

    nombre VARCHAR(100) NOT NULL,

    rol VARCHAR(20) NOT NULL
        CHECK (rol IN ('alumno', 'profesor')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE materias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nombre VARCHAR(100) NOT NULL,

    profesor_id UUID NOT NULL,

    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
);

CREATE TABLE alumno_materia (
    alumno_id UUID NOT NULL,
    materia_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (alumno_id, materia_id),

    CONSTRAINT fk_alumno
        FOREIGN KEY (alumno_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_materia
        FOREIGN KEY (materia_id)
        REFERENCES materias(id)
        ON DELETE CASCADE
);