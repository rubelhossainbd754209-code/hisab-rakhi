<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('business_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('business_categories')->onDelete('cascade');
            $table->string('name'); // মুদি দোকান টেমপ্লেট
            $table->string('slug')->unique();
            $table->string('thumbnail')->nullable(); // preview image
            $table->text('description')->nullable();
            
            // Template Configuration (JSON)
            $table->json('config'); // colors, terminology, modules, default settings
            
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_templates');
    }
};
