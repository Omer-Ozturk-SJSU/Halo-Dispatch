#!/usr/bin/env python3
"""
SQLite migration script to add external_call_id field to calls table
"""

import sqlite3
import os
from pathlib import Path

def migrate_sqlite_database():
    """Add external_call_id column to calls table in SQLite"""
    db_path = Path("halo_dispatch.db")
    
    if not db_path.exists():
        print("❌ Database file not found. Please run main.py first to create the database.")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(calls)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'external_call_id' not in columns:
            # Add the column
            cursor.execute("ALTER TABLE calls ADD COLUMN external_call_id TEXT")
            
            # Create index for performance
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_calls_external_call_id ON calls(external_call_id)")
            
            # Create unique constraint (SQLite doesn't support adding unique constraint to existing table)
            # We'll handle uniqueness in the application logic
            
            conn.commit()
            print("✅ Successfully added external_call_id column to calls table")
        else:
            print("ℹ️  external_call_id column already exists")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        return False

if __name__ == "__main__":
    print("🔄 Running SQLite database migration...")
    if migrate_sqlite_database():
        print("✅ Migration completed successfully!")
    else:
        print("❌ Migration failed!") 