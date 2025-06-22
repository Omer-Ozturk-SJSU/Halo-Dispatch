#!/usr/bin/env python3
"""
Setup script for VAPI call forwarding system
"""

import os
import sys
from pathlib import Path

def create_env_file():
    """Create .env file with required variables"""
    env_content = """# VAPI Configuration
VAPI_WEBHOOK_SECRET=your_vapi_webhook_secret_here
DISPATCHER_PHONE_NUMBER=+1234567890  # Replace with your dispatcher's actual phone number

# Database Configuration (SQLite - default)
DATABASE_URL=sqlite:///./halo_dispatch.db

# API Keys (if needed for other integrations)
OPENAI_API_KEY=your_openai_api_key_here
"""
    
    env_path = Path(".env")
    if not env_path.exists():
        with open(env_path, "w") as f:
            f.write(env_content)
        print("✅ Created .env file - please update with your actual values")
    else:
        print("ℹ️  .env file already exists")

def run_migration():
    """Run database migration"""
    print("🔄 Running database migration...")
    try:
        from db.migrate_sqlite import migrate_sqlite_database
        if migrate_sqlite_database():
            print("✅ Database migration completed")
        else:
            print("❌ Database migration failed")
            return False
    except Exception as e:
        print(f"❌ Migration error: {e}")
        return False
    return True

def test_database_connection():
    """Test database connection"""
    print("🔄 Testing database connection...")
    try:
        from db.models import engine
        connection = engine.connect()
        connection.close()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def print_next_steps():
    """Print next steps for user"""
    print("\n" + "="*60)
    print("🎉 SETUP COMPLETE! Next steps:")
    print("="*60)
    print()
    print("1. 📝 Update your .env file with actual values:")
    print("   - DISPATCHER_PHONE_NUMBER (your real number)")
    print("   - VAPI_WEBHOOK_SECRET (from VAPI dashboard)")
    print("   - Database credentials")
    print()
    print("2. 🌐 In your VAPI dashboard:")
    print("   - Create new assistant (see VAPI_SETUP_GUIDE.md)")
    print("   - Set webhook URL to: https://your-domain.com/webhook/vapi")
    print("   - Configure call forwarding")
    print()
    print("3. 🚀 Start your server:")
    print("   cd halo-backend")
    print("   python main.py")
    print()
    print("4. 🧪 Test the integration:")
    print("   - Call your VAPI number")
    print("   - Check logs for transcript data")
    print("   - Visit: http://localhost:8000/test/calls/test_call_123")
    print()
    print("📖 Read VAPI_SETUP_GUIDE.md for detailed instructions!")

def main():
    print("🔧 Setting up VAPI Call Forwarding System...")
    print()
    
    # Change to script directory
    os.chdir(Path(__file__).parent)
    
    # Create environment file
    create_env_file()
    
    # Test database connection
    if not test_database_connection():
        print("❌ Please fix database connection before continuing")
        sys.exit(1)
    
    # Run migration
    if not run_migration():
        print("❌ Please fix migration issues before continuing")
        sys.exit(1)
    
    # Print next steps
    print_next_steps()

if __name__ == "__main__":
    main() 