namespace AssessmentApp.Models
{
    public class LanguageModel
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
    }

    public class EnglishArabicFormViewModel
    {
        public List<LanguageModel> English { get; set; } = [];
        public List<LanguageModel> Arabic { get; set; } = [];
    }
}
