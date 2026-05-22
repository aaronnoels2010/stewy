# Quick Start Commands

## Application Execution
```bash
./gradlew bootRun
```

## Running Tests
```bash
./gradlew test
```

## Clean & Build Project
```bash
./gradlew clean build
```

## Compilation Validation
```bash
./gradlew compileJava compileTestJava
```

## DB Migration & Running postgres locally
- Ensure a local postgres instance is running on port `5432` with database `stewy` (username: `stewy`, password: `krcgenk`).
- The application uses `hibernate.ddl-auto=update` to manage the schema during local development.
