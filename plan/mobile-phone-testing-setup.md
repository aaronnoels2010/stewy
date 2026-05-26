# Mobile Phone Testing Setup

## Changes Needed

### 1. Backend: `WebSecurityConfig.java`

**File:** `stewy-api/src/main/java/be/an/stewy/stewyapi/WebSecurityConfig.java`

Add `@Value` import and inject `allowedOrigins` from properties:

```java
import org.springframework.beans.factory.annotation.Value;

// Add field:
@Value("${cors.allowed-origins}")
private String[] allowedOrigins;

// Replace hardcoded list with:
config.setAllowedOrigins(List.of(allowedOrigins));
```

### 2. Backend: `application.properties`

**File:** `stewy-api/src/main/resources/application.properties`

Add at end:
```properties
cors.allowed-origins=http://localhost:3000,http://localhost:8081,http://localhost:19006
```

### 3. Mobile: `.env.example`

**File:** `stewy-mobile/.env.example`

```env
# Copy to .env.local (already gitignored) to override the API URL
# Replace with your machine's local IP address
EXPO_PUBLIC_API_URL=http://192.168.1.42:8080
```

## Usage

```bash
# 1. Find your machine's local IP
ipconfig getifaddr en0

# 2. Start API with CORS allowing your phone to connect
cd stewy-api
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:8081,http://localhost:19006,http://<YOUR_IP>:8080" ./gradlew bootRun

# 3. Tell mobile app to use your machine's IP
echo "EXPO_PUBLIC_API_URL=http://<YOUR_IP>:8080" > stewy-mobile/.env.local

# 4. Start Expo dev server
cd stewy-mobile && npx expo start

# 5. Scan QR code with Expo Go on your phone
```

**Requirements:**
- Phone and laptop on the same WiFi network
- Expo Go installed on phone
- API server running and accessible from phone (no firewall blocking port 8080)
