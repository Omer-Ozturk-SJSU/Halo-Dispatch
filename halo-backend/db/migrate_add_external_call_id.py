#!/usr/bin/env python3
"""
Migration script to add external_call_id field to calls table
Run this after updating your models.py
"""

from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
MYSQL_USER = os.getenv('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_DB = os.getenv('MYSQL_DB', 'halo_dispatch')

SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"

def migrate_database():
    """Add external_call_id column to calls table"""
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Check if column already exists
            result = connection.execute(text("""
                SELECT COUNT(*) as count 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s 
                AND TABLE_NAME = 'calls' 
                AND COLUMN_NAME = 'external_call_id'
            """), (MYSQL_DB,))
            
            if result.fetchone()[0] == 0:
                # Add the column
                connection.execute(text("""
                    ALTER TABLE calls 
                    ADD COLUMN external_call_id VARCHAR(128) NULL,
                    ADD INDEX idx_calls_external_call_id (external_call_id),
                    ADD CONSTRAINT uk_calls_external_call_id UNIQUE (external_call_id)
                """))
                connection.commit()
                print("✅ Successfully added external_call_id column to calls table")
            else:
                print("ℹ️  external_call_id column already exists")
                
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🔄 Running database migration...")
    if migrate_database():
        print("✅ Migration completed successfully!")
    else:
        print("❌ Migration failed!") 