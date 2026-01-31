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
        Schema::create('business_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // মুদি দোকান
            $table->string('slug')->unique(); // grocery
            $table->string('icon')->default('📊'); // emoji or icon class
            $table->string('image')->nullable(); // category image
            $table->text('description')->nullable();
            $table->json('config')->nullable(); // default config for this category
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_categories');
    }
};
